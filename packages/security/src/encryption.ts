// =============================================================================
// BuyTuk Academy - Audio Encryption Service (AES-256-GCM)
// =============================================================================

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export interface EncryptedPayload {
  ciphertext: Buffer;
  encryptedKey: string; // Base64 encoded
}

export class AudioEncryption {
  private masterKey: Buffer;

  constructor(masterKeyHex: string) {
    if (!masterKeyHex || masterKeyHex.length !== 64) {
      throw new Error("Master key must be 64 hex characters (32 bytes)");
    }
    this.masterKey = Buffer.from(masterKeyHex, "hex");
  }

  /**
   * Encrypt audio buffer with per-file DEK, then encrypt DEK with master KEK
   */
  async encrypt(plaintext: Buffer): Promise<EncryptedPayload> {
    // 1. Generate unique DEK per file
    const dek = randomBytes(KEY_LENGTH);
    const iv = randomBytes(IV_LENGTH);

    // 2. Encrypt audio with DEK (AES-256-GCM)
    const cipher = createCipheriv(ALGORITHM, dek, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Combine: IV + encrypted + authTag
    const ciphertext = Buffer.concat([iv, encrypted, authTag]);

    // 3. Encrypt DEK with master KEK
    const kekIv = randomBytes(IV_LENGTH);
    const kekCipher = createCipheriv(ALGORITHM, this.masterKey, kekIv);
    const encryptedDek = Buffer.concat([
      kekCipher.update(dek),
      kekCipher.final(),
    ]);
    const kekAuthTag = kekCipher.getAuthTag();

    // Combine: KEK IV + encrypted DEK + authTag
    const encryptedKey = Buffer.concat([kekIv, encryptedDek, kekAuthTag]).toString(
      "base64"
    );

    return { ciphertext, encryptedKey };
  }

  /**
   * Decrypt audio buffer
   */
  async decrypt(
    ciphertext: Buffer,
    encryptedKeyBase64: string
  ): Promise<Buffer> {
    // 1. Parse encrypted key
    const keyBuffer = Buffer.from(encryptedKeyBase64, "base64");
    const kekIv = keyBuffer.slice(0, IV_LENGTH);
    const encryptedDek = keyBuffer.slice(
      IV_LENGTH,
      keyBuffer.length - AUTH_TAG_LENGTH
    );
    const kekAuthTag = keyBuffer.slice(keyBuffer.length - AUTH_TAG_LENGTH);

    // 2. Decrypt DEK
    const kekDecipher = createDecipheriv(ALGORITHM, this.masterKey, kekIv);
    kekDecipher.setAuthTag(kekAuthTag);
    const dek = Buffer.concat([
      kekDecipher.update(encryptedDek),
      kekDecipher.final(),
    ]);

    // 3. Parse ciphertext
    const iv = ciphertext.slice(0, IV_LENGTH);
    const encrypted = ciphertext.slice(
      IV_LENGTH,
      ciphertext.length - AUTH_TAG_LENGTH
    );
    const authTag = ciphertext.slice(ciphertext.length - AUTH_TAG_LENGTH);

    // 4. Decrypt audio
    const decipher = createDecipheriv(ALGORITHM, dek, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return plaintext;
  }

  /**
   * Generate a new random master key (for setup)
   */
  static generateMasterKey(): string {
    return randomBytes(KEY_LENGTH).toString("hex");
  }
}

let encryptionInstance: AudioEncryption | null = null;

export function getEncryptionService(): AudioEncryption {
  if (!encryptionInstance) {
    const masterKey = process.env.AUDIO_KEK;
    if (!masterKey) {
      throw new Error("AUDIO_KEK environment variable is not set");
    }
    encryptionInstance = new AudioEncryption(masterKey);
  }
  return encryptionInstance;
}