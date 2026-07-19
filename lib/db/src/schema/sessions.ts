import {
  pgTable,
  text,
  integer,
  timestamp,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { tenantsTable } from "./tenants";
import { usersTable } from "./users";
import { studentsTable } from "./schools";

export const readingSessionsTable = pgTable("reading_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenantsTable.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => studentsTable.id, { onDelete: "restrict" }),
  teacherId: text("teacher_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),
  sessionType: text("session_type", {
    enum: [
      "reading",
      "dictation",
      "writing",
      "pronunciation",
      "fluency",
      "thinking",
    ],
  })
    .notNull()
    .default("reading"),
  rawScore: integer("raw_score"),
  fluencyScore: real("fluency_score"),
  comprehensionScore: real("comprehension_score"),
  pronunciationScore: real("pronunciation_score"),
  durationSeconds: integer("duration_seconds"),
  status: text("status", {
    enum: ["draft", "completed", "reviewed"],
  })
    .notNull()
    .default("completed"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const evidenceItemsTable = pgTable("evidence_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenantsTable.id, { onDelete: "cascade" }),
  sessionId: text("session_id")
    .notNull()
    .references(() => readingSessionsTable.id, { onDelete: "cascade" }),
  evidenceType: text("evidence_type", {
    enum: [
      "word_error",
      "hesitation",
      "self_correction",
      "fluency_break",
      "comprehension_answer",
      "pronunciation_error",
    ],
  }).notNull(),
  value: text("value"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertReadingSessionSchema = createInsertSchema(
  readingSessionsTable
).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEvidenceItemSchema = createInsertSchema(
  evidenceItemsTable
).omit({ id: true, createdAt: true });

export const selectReadingSessionSchema =
  createSelectSchema(readingSessionsTable);
export const selectEvidenceItemSchema = createSelectSchema(evidenceItemsTable);

export type InsertReadingSession = z.infer<typeof insertReadingSessionSchema>;
export type ReadingSession = typeof readingSessionsTable.$inferSelect;
export type InsertEvidenceItem = z.infer<typeof insertEvidenceItemSchema>;
export type EvidenceItem = typeof evidenceItemsTable.$inferSelect;
