import Redis from "ioredis";
import "@/config/env";

// Global Redis client and connection promise
let redisClient: Redis | null = null;
let connectionPromise: Promise<void> | null = null;

/**
 * Establishes a Redis connection (singleton)
 */
export async function connectRedis(): Promise<void> {
  if (connectionPromise) return connectionPromise;

  connectionPromise = new Promise<void>((resolve, reject) => {
    try {
      const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
      redisClient = new Redis(redisUrl);

      redisClient.on("connect", () => {
        console.log("✅ Redis connected successfully");
        resolve();
      });

      redisClient.on("error", (err) => {
        console.error("❌ Redis connection failed:", err);
        connectionPromise = null;
        reject(err);
      });
    } catch (error) {
      console.error("Redis initialization error:", error);
      connectionPromise = null;
      reject(error);
    }
  });

  return connectionPromise;
}

/**
 * Ensures a Redis connection exists before using it
 */
export async function ensureRedisConnection(): Promise<void> {
  if (!redisClient || !redisClient.status || redisClient.status !== "ready") {
    await connectRedis();
  }
}

/**
 * Safely runs a Redis operation with auto connection handling
 */
export async function withRedisConnection<T>(
  operation: (client: Redis) => Promise<T>
): Promise<T> {
  try {
    await ensureRedisConnection();
    if (!redisClient) throw new Error("Redis client not initialized");
    return await operation(redisClient);
  } catch (error) {
    console.error("Redis operation failed:", error);
    throw error;
  }
}

/**
 * Checks Redis connection health by sending a PING
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await ensureRedisConnection();
    if (!redisClient) return false;

    const response = await redisClient.ping();
    return response === "PONG";
  } catch (error) {
    console.error("Redis health check failed:", error);
    return false;
  }
}

/**
 * Exports a shared Redis instance (lazy initialized)
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error(
      "Redis not connected — call ensureRedisConnection() first."
    );
  }
  return redisClient;
}
