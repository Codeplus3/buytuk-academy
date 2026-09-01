// =============================================================================
// BuyTuk Academy - Global Constants
// =============================================================================

// ===== Application =====
export const APP_NAME = "BuyTuk Academy";
export const APP_VERSION = "1.0.0";
export const APP_LOCALE = "ar";

// ===== Audio =====
export const DEFAULT_SAMPLE_RATE = 16000;
export const DEFAULT_CHANNELS = 1;
export const DEFAULT_BIT_DEPTH = 16;
export const MAX_AUDIO_DURATION_SEC = 300;
export const MIN_AUDIO_DURATION_SEC = 1;
export const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const AUDIO_CHUNK_SIZE_MS = 1000;

// ===== Scoring =====
export const SCORE_EXCELLENT = 85;
export const SCORE_GOOD = 70;
export const SCORE_PASSING = 50;
export const SCORE_NEEDS_IMPROVEMENT = 0;

export const WPM_IDEAL = 120;
export const WPM_MIN = 60;
export const WPM_MAX = 180;

// ===== Mastery =====
export const MASTERY_LEVELS = {
  MASTERED: 85,
  PROGRESSING: 70,
  DEVELOPING: 50,
  NEEDS_SUPPORT: 0,
} as const;

// ===== Pagination =====
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ===== Rate Limiting =====
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;

// ===== JWT =====
export const JWT_EXPIRES_IN = "7d";
export const JWT_REFRESH_EXPIRES_IN = "30d";

// ===== WebSocket =====
export const WS_PING_INTERVAL_MS = 25000;
export const WS_PING_TIMEOUT_MS = 60000;

// ===== Queue =====
export const QUEUE_MAX_RETRIES = 3;
export const QUEUE_BACKOFF_DELAY_MS = 2000;
export const QUEUE_CONCURRENCY = 3;

// ===== Inference =====
export const INFERENCE_TIMEOUT_MS = 60000;
export const INFERENCE_MAX_RETRIES = 2;

// ===== Storage =====
export const S3_PRESIGNED_URL_EXPIRES_SEC = 3600;

// ===== Encryption =====
export const ENCRYPTION_ALGORITHM = "aes-256-gcm";
export const ENCRYPTION_KEY_LENGTH = 32;
export const ENCRYPTION_IV_LENGTH = 16;
export const ENCRYPTION_AUTH_TAG_LENGTH = 16;