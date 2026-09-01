// =============================================================================
// BuyTuk Academy - Sessions Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { lessons } from "./lessons.js";

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => users.id)
      .notNull(),
    lessonId: integer("lesson_id").references(() => lessons.id),
    startedAt: timestamp("started_at").defaultNow(),
    endedAt: timestamp("ended_at"),
    status: text("status").default("active"), // active, completed, abandoned
    metadata: jsonb("metadata"),
  },
  (table) => ({
    studentIdx: index("sessions_student_idx").on(table.studentId),
    statusIdx: index("sessions_status_idx").on(table.status),
  })
);

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;