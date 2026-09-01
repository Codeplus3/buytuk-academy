// =============================================================================
// BuyTuk Academy - ID Generation Utilities
// =============================================================================

import { randomBytes, createHash } from "crypto";

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

/**
 * Generate a short unique ID (8 characters)
 */
export function generateShortId(): string {
  return randomBytes(4).toString("hex");
}

/**
 * Generate a correlation ID for request tracing
 */
export function generateCorrelationId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(8).toString("hex");
  return `corr-${timestamp}-${random}`;
}

/**
 * Generate a deterministic ID from input
 */
export function generateDeterministicId(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 16);
}

/**
 * Generate a session ID
 */
export function generateSessionId(): string {
  return `sess_${randomBytes(16).toString("hex")}`;
}

/**
 * Generate a job ID for queue jobs
 */
export function generateJobId(prefix: string): string {
  const timestamp = Date.now();
  const random = randomBytes(4).toString("hex");
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Generate a file key for S3
 */
export function generateS3Key(
  bucket: string,
  userId: number,
  extension: string
): string {
  const timestamp = Date.now();
  const random = randomBytes(8).toString("hex");
  return `${bucket}/${userId}/${timestamp}-${random}.${extension}`;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a nanoid-style ID
 */
export function generateNanoId(length: number = 21): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  const bytes = randomBytes(length);
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars[bytes[i] % chars.length];
  }
  return id;
}