// =============================================================================
// BuyTuk Academy - Student Exercises Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { exercises } from "./exercises.js";
import { reports } from "./reports.js";

export const studentExercises = pgTable(
  "student_exercises",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => users.id)
      .notNull(),
    exerciseId: text("exercise_id")
      .references(() => exercises.id)
      .notNull(),
    assignedAt: timestamp("assigned_at").defaultNow(),
    completedAt: timestamp("completed_at"),
    status: text("status").default("pending"), // pending, in_progress, completed
    assignedByReportId: integer("assigned_by_report_id").references(
      () => reports.id
    ),
    assignedByTeacherId: integer("assigned_by_teacher_id").references(
      () => users.id
    ),
  },
  (table) => ({
    studentIdx: index("student_exercises_student_idx").on(table.studentId),
    statusIdx: index("student_exercises_status_idx").on(table.status),
  })
);

export type StudentExercise = typeof studentExercises.$inferSelect;
export type NewStudentExercise = typeof studentExercises.$inferInsert;