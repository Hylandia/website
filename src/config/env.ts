import { z } from "zod";
import { readFileSync } from "fs";
import path from "path";
import fs from "fs";
import { ZodUtils } from "@/lib/zod-utils";

function loadEnv() {
  try {
    const envFile = fs.readFileSync(
      path.join(process.cwd(), ".env.local"),
      "utf-8"
    );
    const envVars: Record<string, string> = {};

    envFile.split("\n").forEach((line, index) => {
      const cleanLine = line.trim().replace(/\r$/, "");
      if (cleanLine === "" || cleanLine.startsWith("#")) {
        return;
      }

      const match = cleanLine.match(/^([^=]+)=(.*)$/);
      if (match?.[1] && match[2] !== undefined) {
        const key = match[1].trim();
        let value = match[2].trim();

        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        envVars[key] = value;
      }
    });

    return { ...process.env, ...envVars };
  } catch (error) {
    console.warn("No .env file found, using process.env");
    return { ...process.env };
  }
}

const envVars = loadEnv();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URI: z.string(),
  REDIS_URI: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRY: z.string().default("30d"),
});

try {
  envSchema.parse(envVars);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      "❌ Invalid environment variables:",
      ZodUtils.FormatIssuesAsMessage(error.issues)
    );
    process.exit(1);
  }
}

export const env = envSchema.parse(envVars);

export type Env = z.infer<typeof envSchema>;
