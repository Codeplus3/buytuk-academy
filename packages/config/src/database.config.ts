import { z } from "zod";

const databaseSchema = z.object({
  url: z.string().url(),
  poolMin: z.coerce.number().int().min(1).default(5),
  poolMax: z.coerce.number().int().min(1).default(20),
});

export type DatabaseConfig = z.infer<typeof databaseSchema>;

export const databaseConfig: DatabaseConfig = databaseSchema.parse({
  url: process.env.DATABASE_URL,
  poolMin: process.env.DATABASE_POOL_MIN,
  poolMax: process.env.DATABASE_POOL_MAX,
});