import { z } from "zod";

const scoringSchema = z.object({
  accuracyWeight: z.number().min(0).max(1).default(0.4),
  pronunciationWeight: z.number().min(0).max(1).default(0.3),
  fluencyWeight: z.number().min(0).max(1).default(0.2),
  prosodyWeight: z.number().min(0).max(1).default(0.1),
  passingScore: z.number().min(0).max(100).default(70),
  excellentScore: z.number().min(0).max(100).default(90),
});

export type ScoringConfig = z.infer<typeof scoringSchema>;

export const scoringConfig: ScoringConfig = scoringSchema.parse({
  accuracyWeight: 0.4,
  pronunciationWeight: 0.3,
  fluencyWeight: 0.2,
  prosodyWeight: 0.1,
  passingScore: 70,
  excellentScore: 90,
});