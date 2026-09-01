// =============================================================================
// BuyTuk Academy - Audio Files Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  real,
  uuid,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const audioFiles = pgTable(
  "audio_files",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    attemptId: integer("attempt_id"),
    s3Key: text("s3_key").notNull(),
    encryptedKey: text("encrypted_key"),
    durationSec: real("duration_sec"),
    sampleRate: integer("sample_rate"),
    sizeBytes: integer("size_bytes"),
    format: text("format").default("wav"),
    checksum: text("checksum"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    attemptIdx: index("audio_files_attempt_idx").on(table.attemptId),
  })
);

export type AudioFile = typeof audioFiles.$inferSelect;
export type NewAudioFile = typeof audioFiles.$inferInsert;