import { z } from "zod";

const audioSchema = z.object({
  sampleRate: z.number().int().default(16000),
  channels: z.number().int().default(1),
  bitDepth: z.number().int().default(16),
  maxDurationSeconds: z.number().int().default(120),
  chunkSizeMs: z.number().int().default(1000),
  format: z.enum(["wav", "webm", "mp3"]).default("webm"),
});

export type AudioConfig = z.infer<typeof audioSchema>;

export const audioConfig: AudioConfig = audioSchema.parse({
  sampleRate: 16000,
  channels: 1,
  bitDepth: 16,
  maxDurationSeconds: 120,
  chunkSizeMs: 1000,
  format: "webm",
});