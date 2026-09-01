import { z } from "zod";

const pipelineSchema = z.object({
  enableAudioEnhancement: z.boolean().default(true),
  enableFeatureExtraction: z.boolean().default(true),
  enableVad: z.boolean().default(true),
  enableStt: z.boolean().default(true),
  enableForcedAlignment: z.boolean().default(true),
  enableG2p: z.boolean().default(true),
  enablePhonemeAnalysis: z.boolean().default(true),
  enableAiFeedback: z.boolean().default(true),
  timeoutMs: z.coerce.number().int().min(1000).default(60000),
  maxRetries: z.coerce.number().int().min(0).max(5).default(3),
});

export type PipelineConfig = z.infer<typeof pipelineSchema>;

export const pipelineConfig: PipelineConfig = pipelineSchema.parse({
  enableAudioEnhancement: true,
  enableFeatureExtraction: true,
  enableVad: true,
  enableStt: true,
  enableForcedAlignment: true,
  enableG2p: true,
  enablePhonemeAnalysis: true,
  enableAiFeedback: true,
  timeoutMs: 60000,
  maxRetries: 3,
});