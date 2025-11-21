import { SocketMiddleware } from "./types";

/**
 * Require authentication middleware
 */
export const requireAuth: SocketMiddleware = (client, message, next) => {
  if (!client.authenticated) {
    client.ws.send(
      JSON.stringify({
        t: "error",
        evt: "error",
        data: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      })
    );
    return;
  }
  next();
};

/**
 * Rate limiting middleware
 */
export function rateLimit(
  maxRequests: number,
  windowMs: number
): SocketMiddleware {
  const clientRequests = new Map<string, number[]>();

  return (client, message, next) => {
    const now = Date.now();
    const requests = clientRequests.get(client.id) || [];

    // Filter out old requests
    const recentRequests = requests.filter((time) => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      client.ws.send(
        JSON.stringify({
          t: "error",
          evt: "error",
          data: {
            code: "RATE_LIMIT",
            message: "Too many requests",
          },
        })
      );
      return;
    }

    recentRequests.push(now);
    clientRequests.set(client.id, recentRequests);

    next();
  };
}

/**
 * Logging middleware
 */
export const logger: SocketMiddleware = (client, message, next) => {
  console.log(
    `[${new Date().toISOString()}] Client ${client.id} (${
      client.userId || "anonymous"
    }): ${message.t}:${message.evt}`
  );
  next();
};
