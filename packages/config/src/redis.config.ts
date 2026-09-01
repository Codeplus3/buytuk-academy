import { z } from "zod";

const redisSchema = z.object({
  url: z.string().url(),
  prefix: z.string().default("buytuk:"),
});

export type RedisConfig = z.infer<typeof redisSchema>;

export const redisConfig: RedisConfig = redisSchema.parse({
  url: process.env.REDIS_URL,
  prefix: process.env.REDIS_PREFIX,
});