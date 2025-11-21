import { withNextAPI, Responses, Errors } from "@/lib/api-utils";
import { clerkClient, verifyToken } from "@clerk/nextjs/server";
import { UserQueries } from "@/lib/db/models";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export const GET = (request: Request) =>
  withNextAPI({ request, ensureAuth: false }, async () => {
    return Responses.Success({
      message:
        "Auth verify endpoint. Use POST with { token: 'your_jwt_token' }",
      endpoint: "/api/v1/auth/verify",
      method: "POST",
      body: {
        token: "string (required) - JWT token",
      },
    });
  });

export const POST = (request: Request) =>
  withNextAPI({ request, ensureAuth: false }, async () => {
    let body;
    try {
      const text = await request.text();
      if (!text || text.trim() === "") {
        throw new Errors.BadRequest("Request body is empty");
      }
      body = JSON.parse(text);
    } catch (error) {
      if (error instanceof Errors.BadRequest) {
        throw error;
      }
      throw new Errors.BadRequest(
        "Invalid JSON in request body. Expected: { token: 'your_jwt_token' }"
      );
    }

    const { token } = body;

    if (!token) {
      throw new Errors.BadRequest("Token is required in request body");
    }

    if (typeof token !== "string") {
      throw new Errors.BadRequest("Token must be a string");
    }

    try {
      let payload: any;
      let tokenType: string | undefined;

      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const decoded = JSON.parse(
            Buffer.from(parts[1], "base64url").toString("utf-8")
          );
          tokenType = decoded.type;
        }
      } catch (e) {
        throw new Errors.Unauthorized("Invalid token format");
      }

      if (tokenType === "oauth") {
        payload = jwt.verify(token, env.JWT_SECRET, {
          algorithms: ["HS256"],
          issuer: "hylandia-backend",
          audience: "hylandia-client",
        }) as any;
      } else {
        payload = await verifyToken(token, {});
      }

      if (!payload || !payload.sub) {
        throw new Errors.Unauthorized("Invalid token");
      }

      const client = await clerkClient();
      const clerkUser = await client.users.getUser(payload.sub);

      const user = await UserQueries.findOrCreateFromClerk(clerkUser);

      return Responses.Success({
        user: {
          _id: user._id?.toString(),
          clerkId: user.clerkId,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          role: user.role,
          permissions: user.permissions,
          preferences: user.preferences,
          stats: user.stats,
        },
        authenticated: true,
      });
    } catch (error: any) {
      if (error instanceof Errors.APIError) {
        throw error;
      }
      throw new Errors.Unauthorized("Authentication failed");
    }
  });
