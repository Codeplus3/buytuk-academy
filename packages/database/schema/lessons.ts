// =============================================================================
// BuyTuk Academy - Lessons Schema
// =============================================================================

import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { subjects } from "./subjects.js";

export const lessons = pgTable(
  "lessons",
  {
    id: serial("id").primaryKey(),
    subjectId: integer("subject_id")
      .references(() => subjects.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    order: integer("order").notNull(),
    durationMinutes: integer("duration_minutes"),
    difficulty: integer("difficulty").default(1),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    subjectIdx: index("lessons_subject_idx").on(table.subjectId),
  })
);

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;