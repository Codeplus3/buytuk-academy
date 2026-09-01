import { z } from "zod";

const appSchema = z.object({
  nodeEnv: z.enum(["development", "production", "test", "staging"]).default("development"),
  appVersion: z.string().default("1.0.0"),
  appName: z.string().default("buytuk-academy"),
  port: z.coerce.number().int().min(1).max(65535).default(4000),
  host: z.string().default("0.0.0.0"),
  logLevel: z.enum(["debug", "info", "warn", "error"]).default("info"),
  corsOrigin: z.string().default("http://localhost:3000"),
});

export type AppConfig = z.infer<typeof appSchema>;

export const appConfig: AppConfig = appSchema.parse({
  nodeEnv: process.env.NODE_ENV,
  appVersion: process.env.APP_VERSION,
  appName: process.env.APP_NAME,
  port: process.env.PORT,
  host: process.env.HOST,
  logLevel: process.env.LOG_LEVEL,
  corsOrigin: process.env.CORS_ORIGIN,
});