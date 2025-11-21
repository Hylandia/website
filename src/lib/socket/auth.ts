import { createHmac } from "crypto";
import { env } from "@/config/env";
import { AuthPayload } from "./types";
import jwt from "jsonwebtoken";
import { verifyToken } from "@clerk/nextjs/server";

/**
 * Generate SHA256 signature for authentication
 */
export function generateSignature(token: string, timestamp: number): string {
  const data = `${token}:${timestamp}`;
  return createHmac("sha256", env.JWT_SECRET).update(data).digest("hex");
}

/**
 * Verify SHA256 signature
 */
export function verifySignature(
  token: string,
  timestamp: number,
  signature: string
): boolean {
  const expected = generateSignature(token, timestamp);
  return expected === signature;
}

/**
 * Verify authentication payload
 * Returns userId if valid, null otherwise
 * Supports both OAuth JWT tokens and Clerk session tokens
 */
export async function verifyAuthPayload(
  payload: AuthPayload
): Promise<string | null> {
  try {
    const now = Date.now();
    const diff = Math.abs(now - payload.timestamp);
    if (diff > 5 * 60 * 1000) {
      console.error("Auth timestamp expired");
      return null;
    }

    if (!verifySignature(payload.token, payload.timestamp, payload.signature)) {
      console.error("Invalid signature");
      return null;
    }

    let tokenType: string | undefined;
    try {
      const parts = payload.token.split(".");
      if (parts.length === 3) {
        const decoded = JSON.parse(
          Buffer.from(parts[1], "base64url").toString("utf-8")
        );
        tokenType = decoded.type;
      }
    } catch (e) {
      // Could be clerk token?
    }

    if (tokenType === "oauth") {
      const decoded = jwt.verify(payload.token, env.JWT_SECRET, {
        algorithms: ["HS256"],
      }) as any;

      if (!decoded || !decoded.sub) {
        console.error("Invalid OAuth token payload");
        return null;
      }

      return decoded.sub;
    }
    try {
      const decoded = await verifyToken(payload.token, {});

      if (decoded && decoded.sub) {
        return decoded.sub;
      }
    } catch (clerkError) {
      console.error("Clerk token verification failed:", clerkError);
    }

    console.error("Token verification failed for both OAuth and Clerk");
    return null;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

/**
 * Create authentication payload for client
 */
export function createAuthPayload(token: string): AuthPayload {
  const timestamp = Date.now();
  const signature = generateSignature(token, timestamp);

  return {
    token,
    timestamp,
    signature,
  };
}
