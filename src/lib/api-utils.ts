import { NextResponse } from "next/server";
import { withDBConnection } from "./db";
import { domainToASCII } from "url";
import {
  auth,
  clerkClient,
  currentUser,
  verifyToken,
} from "@clerk/nextjs/server";
import { withRedisConnection } from "./redis";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { getUserEffectivePermissions } from "./rbac";

const STATUS_TO_CODE: Record<number, string> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  429: "RATE_LIMIT_EXCEEDED",
  500: "INTERNAL_ERROR",
};

const CODE_TO_STATUS: Record<string, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 400,
  DATABASE_ERROR: 500,
  RATE_LIMIT_EXCEEDED: 429,
  INTERNAL_ERROR: 500,
};

export interface SuccessResponse<T = any, U = any> {
  data: T;
  success: true;
  message?: string;
  metadata: U;
}

export interface ErrorResponse {
  message: string;
  error: {
    code: string;
    statusCode: number;
  };
  success: false;
}

export type APIResponse<T = any, U = any> =
  | SuccessResponse<T, U>
  | ErrorResponse;

export namespace Errors {
  export class APIError extends Error {
    public readonly statusCode: number;
    public readonly code: string;

    constructor(
      message: string,
      statusCodeOrCode?: number | string,
      codeOrStatusCode?: string | number
    ) {
      super(message);

      let statusCode: number;
      let code: string;

      if (typeof statusCodeOrCode === "number") {
        statusCode = statusCodeOrCode;

        if (typeof codeOrStatusCode === "string") {
          code = codeOrStatusCode;
        } else {
          code = STATUS_TO_CODE[statusCode] || "INTERNAL_ERROR";
        }
      } else if (typeof statusCodeOrCode === "string") {
        code = statusCodeOrCode;

        if (typeof codeOrStatusCode === "number") {
          statusCode = codeOrStatusCode;
        } else {
          statusCode = CODE_TO_STATUS[code] || 500;
        }
      } else {
        statusCode = 500;
        code = "INTERNAL_ERROR";
      }

      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.code = code;
      this.message = message;

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }

  export class NotFound extends APIError {
    constructor(resource: string = "Resource") {
      super(`${resource} not found`, 404, "NOT_FOUND");
    }
  }

  export class Unauthorized extends APIError {
    constructor(message: string = "Unauthorized access") {
      super(message, 401, "UNAUTHORIZED");
    }
  }

  export class Forbidden extends APIError {
    constructor(message: string = "Access forbidden") {
      super(message, 403, "FORBIDDEN");
    }
  }

  export class BadRequest extends APIError {
    constructor(message: string = "Bad request") {
      super(message, 400, "BAD_REQUEST");
    }
  }

  export class Conflict extends APIError {
    constructor(message: string = "Resource conflict") {
      super(message, 409, "CONFLICT");
    }
  }

  export class ValidationError extends APIError {
    constructor(message: string = "Validation failed") {
      super(message, 400, "VALIDATION_ERROR");
    }
  }

  export class DatabaseError extends APIError {
    constructor(message: string = "Database operation failed") {
      super(message, 500, "DATABASE_ERROR");
    }
  }

  export class RateLimitError extends APIError {
    constructor(message: string = "Rate limit exceeded") {
      super(message, 429, "RATE_LIMIT_EXCEEDED");
    }
  }
}

export namespace Responses {
  export type Response<T = unknown> = NextResponse<APIResponse<T>>;

  export function Success<T>(
    data: T,
    message?: string
  ): NextResponse<SuccessResponse<T>> {
    if ((data as any).data) {
      return NextResponse.json({
        data: (data as any).data,
        success: true,
        metadata: Object.keys(data as any)
          .filter((k) => k !== "data")
          .reduce((acc, k) => {
            acc[k] = (data as any)[k];
            return acc;
          }, {} as Record<string, any>),
        ...(message && { message }),
      });
    }
    return NextResponse.json({
      data,
      success: true,
      ...(message && { message }),
      metadata: {},
    });
  }

  export function Error(error: Errors.APIError): NextResponse<ErrorResponse> {
    return NextResponse.json(
      {
        message: error.message,
        error: {
          code: error.code,
          statusCode: error.statusCode,
        },
        success: false,
      },
      { status: error.statusCode }
    );
  }

  export function GenericError(
    message: string,
    code: string = "INTERNAL_ERROR",
    statusCode: number = 500
  ): NextResponse<ErrorResponse> {
    return NextResponse.json(
      {
        message,
        error: { code, statusCode },
        success: false,
      },
      { status: statusCode }
    );
  }
}

export interface AuthContext {
  userId: string;
  clerkId: string;
  type: "clerk" | "oauth";
  email?: string;
  username?: string;
  role?: string;
  permissions?: Set<string>;
}

export async function withAPIHandler<T>(
  options: WithNextAPIOptions,
  handler: (auth?: AuthContext) => Promise<T>
): Promise<Responses.Response<T>> {
  try {
    const { ensureAuth, request } = options;
    let authContext: AuthContext | undefined = undefined;

    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      let tokenType: string | undefined;
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(
            Buffer.from(parts[1], "base64url").toString("utf-8")
          );
          tokenType = payload.type;
        }
      } catch (e) {
        if (ensureAuth) {
          throw new Errors.Unauthorized("Invalid token format");
        }
      }

      let isValid = false;

      if (tokenType === "oauth") {
        try {
          const payload = jwt.verify(token, env.JWT_SECRET, {
            algorithms: ["HS256"],
            issuer: "hylandia-backend",
            audience: "hylandia-client",
          }) as any;

          if (payload && payload.sub) {
            isValid = true;
            authContext = {
              userId: payload.sub,
              clerkId: payload.sub,
              type: "oauth",
              email: payload.email,
              username: payload.username,
              role: payload.role,
              permissions: new Set(getUserEffectivePermissions(payload) || []),
            };
          }
        } catch (error: any) {
          if (ensureAuth) {
            throw new Errors.Unauthorized("Invalid or expired token");
          }
        }
      } else {
        try {
          const payload = await verifyToken(token, {});

          if (payload && payload.sub) {
            const clerk = await clerkClient();
            const user = await clerk.users.getUser(payload.sub);
            isValid = true;
            authContext = {
              userId: payload.sub,
              clerkId: payload.sub,
              type: "clerk",
              email: user.emailAddresses?.[0]?.emailAddress,
              username: user.username || undefined,
              role: user.publicMetadata?.role ?? "player",
              permissions: getUserEffectivePermissions(user),
            };
          }
        } catch (error: any) {
          if (ensureAuth) {
            throw new Errors.Unauthorized("Invalid or expired token");
          }
        }
      }

      if (!isValid && ensureAuth) {
        throw new Errors.Unauthorized("Invalid or expired token");
      }
    } else {
      try {
        const currentAuth = await auth();
        if (currentAuth.userId) {
          const user = await currentUser();
          if (user) {
            authContext = {
              userId: currentAuth.userId,
              clerkId: currentAuth.userId,
              email: user.emailAddresses?.[0]?.emailAddress,
              username: user.username || undefined,
              role: user.publicMetadata?.role as string | undefined,
              permissions: getUserEffectivePermissions(user),
              type: "clerk",
            };
          }
        }
      } catch (error) {
        if (ensureAuth) {
          throw new Errors.Unauthorized();
        }
      }

      if (ensureAuth && !authContext) {
        throw new Errors.Unauthorized();
      }
    }
    const data = await handler(authContext);

    if (data instanceof NextResponse) {
      return data;
    }

    if (data && typeof data === "object" && "success" in data) {
      return Responses.Success(data);
    }

    return Responses.Success(data);
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof Errors.APIError) {
      return Responses.Error(error);
    }

    return Responses.GenericError(
      "An unexpected error occurred",
      "INTERNAL_ERROR",
      500
    );
  }
}

interface WithNextAPIOptions {
  request: Request;
  ensureAuth?: boolean;
}

export async function withNextAPI<T extends Record<string, any>>(
  { request, ensureAuth = true }: WithNextAPIOptions,
  handler: (request: Request, auth?: AuthContext) => Promise<T>
): Promise<Response> {
  // nesting hell but oh well
  return withDBConnection(async () => {
    return withRedisConnection(async () => {
      try {
        const result = await withAPIHandler({ request, ensureAuth }, (auth) =>
          handler(request, auth)
        );

        if (result instanceof NextResponse) {
          if (!result.headers.get("Content-Type")) {
            result.headers.set("Content-Type", "application/json");
          }
          return result;
        }

        return new Response(JSON.stringify(result), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Unhandled API Error:", error);

        const errorResponse = Responses.GenericError(
          "Internal server error",
          "INTERNAL_ERROR",
          500
        );

        return new Response(JSON.stringify(await errorResponse.json()), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    });
  });
}
