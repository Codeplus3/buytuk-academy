// =============================================================================
// BuyTuk Academy - Mastery History Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  real,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { lessons } from "./lessons.js";
import { attempts } from "./attempts.js";

export const masteryHistory = pgTable(
  "mastery_history",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => users.id)
      .notNull(),
    lessonId: integer("lesson_id")
      .references(() => lessons.id)
      .notNull(),
    attemptId: integer("attempt_id").references(() => attempts.id),
    score: real("score").notNull(),
    level: text("level").notNull(), // MASTERED, PROGRESSING, DEVELOPING, NEEDS_SUPPORT
    delta: real("delta"),
    trend: text("trend"), // up, down, stable
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    studentLessonIdx: index("mastery_history_student_lesson_idx").on(
      table.studentId,
      table.lessonId
    ),
    createdAtIdx: index("mastery_history_created_at_idx").on(table.createdAt),
  })
);

export type MasteryHistory = typeof masteryHistory.$inferSelect;
export type NewMasteryHistory = typeof masteryHistory.$inferInsert;