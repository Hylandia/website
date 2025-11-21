import { withNextAPI, Responses, Errors } from "@/lib/api-utils";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UserQueries } from "@/lib/db/models";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

/**
 * POST /api/v1/auth/token
 * Generate a JWT token for OAuth flow
 * Returns a JWT that can be used for API authentication
 */
export const POST = (request: Request) =>
  withNextAPI(
    {
      ensureAuth: false,
      request,
    },
    async (req) => {
      const currentAuth = await auth();

      if (!currentAuth.userId) {
        throw new Errors.Unauthorized("Not authenticated");
      }

      const body = await req.json().catch(() => ({}));
      const requestedScope = body.scope || "user:read";

      const client = await clerkClient();
      const clerkUser = await client.users.getUser(currentAuth.userId);

      const user = await UserQueries.findOrCreateFromClerk(clerkUser);

      const token = jwt.sign(
        {
          sub: user.clerkId,
          userId: user._id?.toString(),
          email: user.email,
          username: user.username,
          displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          role: user.role,
          type: "oauth",
          scope: requestedScope,
        },
        env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: env.JWT_EXPIRY,
          issuer: "hylandia-backend",
          audience: "hylandia-client",
        } as jwt.SignOptions
      );

      return Responses.Success({
        token,
        expiresIn: env.JWT_EXPIRY,
        scope: requestedScope,

        user: {
          _id: user._id?.toString(),
          clerkId: user.clerkId,
          email: user.email,
          username: user.username,
          displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          avatarUrl: user.avatar,
          role: user.role,
          permissions: user.permissions,
          preferences: user.preferences,
          stats: user.stats,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }
  );
