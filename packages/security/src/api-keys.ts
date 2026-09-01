// =============================================================================
// BuyTuk Academy - API Keys Management
// =============================================================================

import { createHash, randomBytes } from "node:crypto";

export interface APIKeyRecord {
  id: string;
  name: string;
  keyHash: string;
  permissions: string[];
  createdAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  isActive: boolean;
}

// In-memory store (replace with database in production)
const apiKeysStore = new Map<string, APIKeyRecord>();

/**
 * Generate a new API key
 */
export function generateAPIKey(params: {
  name: string;
  permissions: string[];
  expiresInDays?: number;
}): { key: string; id: string } {
  const { name, permissions, expiresInDays } = params;

  // Generate cryptographically secure key
  const key = `bt_${randomBytes(32).toString("base64url")}`;
  const id = randomBytes(16).toString("hex");

  // Hash the key for storage
  const keyHash = hashKey(key);

  // Calculate expiration
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : undefined;

  // Store record
  const record: APIKeyRecord = {
    id,
    name,
    keyHash,
    permissions,
    createdAt: new Date(),
    expiresAt,
    isActive: true,
  };

  apiKeysStore.set(id, record);

  return { key, id };
}

/**
 * Validate API key
 */
export async function validateAPIKey(
  key: string,
  requiredPermission?: string
): Promise<{ valid: boolean; record?: APIKeyRecord }> {
  const keyHash = hashKey(key);

  // Find record by hash
  let record: APIKeyRecord | undefined;
  for (const r of apiKeysStore.values()) {
    if (r.keyHash === keyHash) {
      record = r;
      break;
    }
  }

  if (!record) {
    return { valid: false };
  }

  // Check if active
  if (!record.isActive) {
    return { valid: false };
  }

  // Check expiration
  if (record.expiresAt && record.expiresAt < new Date()) {
    return { valid: false };
  }

  // Check permission
  if (requiredPermission && !record.permissions.includes(requiredPermission)) {
    return { valid: false };
  }

  // Update last used
  record.lastUsedAt = new Date();

  return { valid: true, record };
}

/**
 * Revoke API key
 */
export function revokeAPIKey(id: string): boolean {
  const record = apiKeysStore.get(id);
  if (!record) {
    return false;
  }

  record.isActive = false;
  return true;
}

/**
 * List all API keys (without exposing actual keys)
 */
export function listAPIKeys(): Array<{
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  isActive: boolean;
}> {
  return Array.from(apiKeysStore.values()).map((r) => ({
    id: r.id,
    name: r.name,
    permissions: r.permissions,
    createdAt: r.createdAt,
    expiresAt: r.expiresAt,
    lastUsedAt: r.lastUsedAt,
    isActive: r.isActive,
  }));
}

/**
 * Hash API key for storage
 */
function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Middleware-style validator for Express
 */
export function apiKeyMiddleware(requiredPermission?: string) {
  return async (req: any, res: any, next: any) => {
    const apiKey = req.headers["x-api-key"] || req.query.api_key;

    if (!apiKey) {
      return res.status(401).json({
        error: "API key required",
        code: "API_KEY_MISSING",
      });
    }

    const { valid, record } = await validateAPIKey(apiKey, requiredPermission);

    if (!valid) {
      return res.status(401).json({
        error: "Invalid or expired API key",
        code: "API_KEY_INVALID",
      });
    }

    req.apiKeyId = record!.id;
    req.apiKeyPermissions = record!.permissions;

    next();
  };
}