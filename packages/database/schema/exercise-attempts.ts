// =============================================================================
// BuyTuk Academy - Exercise Attempts Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  real,
  jsonb,
  uuid,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { studentExercises } from "./student-exercises.js";

export const exerciseAttempts = pgTable(
  "exercise_attempts",
  {
    id: serial("id").primaryKey(),
    studentExerciseId: integer("student_exercise_id")
      .references(() => studentExercises.id)
      .notNull(),
    audioFileId: uuid("audio_file_id"),
    score: real("score"),
    data: jsonb("data"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    studentExerciseIdx: index("exercise_attempts_student_exercise_idx").on(
      table.studentExerciseId
    ),
  })
);

export type ExerciseAttempt = typeof exerciseAttempts.$inferSelect;
export type NewExerciseAttempt = typeof exerciseAttempts.$inferInsert;