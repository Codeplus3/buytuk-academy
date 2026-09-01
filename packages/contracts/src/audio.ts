// =============================================================================
// BuyTuk Academy - Audio Contracts
// =============================================================================

export interface AudioFile {
  id: string;
  attemptId?: number | null;
  s3Key: string;
  encryptedKey?: string | null;
  durationSec?: number | null;
  sampleRate?: number | null;
  sizeBytes?: number | null;
  format: string;
  checksum?: string | null;
  createdAt: Date;
}

export interface AudioUploadRequest {
  studentId: number;
  attemptId: number;
  contentType?: string;
  expiresInSeconds?: number;
}

export interface AudioUploadResponse {
  url: string;
  key: string;
  expiresAt: Date;
}

export interface AudioMetadata {
  durationSec: number;
  sampleRate: number;
  channels: number;
  format: string;
  sizeBytes: number;
}

export const SUPPORTED_AUDIO_FORMATS = ["wav", "webm", "mp3", "ogg"] as const;
export type SupportedAudioFormat = (typeof SUPPORTED_AUDIO_FORMATS)[number];

export const MAX_AUDIO_DURATION_SEC = 300;
export const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB