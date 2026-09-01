import { z } from "zod";

const securitySchema = z.object({
  jwtSecret: z.string().min(32),
  jwtExpiresIn: z.string().default("7d"),
  jwtRefreshExpiresIn: z.string().default("30d"),
  audioKek: z.string().length(64),
  rateLimitWindowMs: z.coerce.number().int().min(1000).default(900000),
  rateLimitMaxRequests: z.coerce.number().int().min(1).default(100),
});

export type SecurityConfig = z.infer<typeof securitySchema>;

export const securityConfig: SecurityConfig = securitySchema.parse({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  audioKek: process.env.AUDIO_KEK,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
});