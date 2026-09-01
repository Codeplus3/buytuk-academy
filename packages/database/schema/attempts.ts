// =============================================================================
// BuyTuk Academy - Attempts Schema
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
import { sessions } from "./sessions.js";
import { users } from "./users.js";
import { lessons } from "./lessons.js";

export const attempts = pgTable(
  "attempts",
  {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id").references(() => sessions.id),
    studentId: integer("student_id")
      .references(() => users.id)
      .notNull(),
    lessonId: integer("lesson_id").references(() => lessons.id),
    audioFileId: uuid("audio_file_id"),
    transcript: text("transcript"),
    durationSec: real("duration_sec"),
    wordCount: integer("word_count"),
    status: text("status").default("pending"), // pending, processing, completed, failed
    correlationId: text("correlation_id"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    studentIdx: index("attempts_student_idx").on(table.studentId),
    lessonIdx: index("attempts_lesson_idx").on(table.lessonId),
    statusIdx: index("attempts_status_idx").on(table.status),
    createdAtIdx: index("attempts_created_at_idx").on(table.createdAt),
  })
);

export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;