// =============================================================================
// BuyTuk Academy - Exams Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  real,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { subjects } from "./subjects.js";
import { classes } from "./classes.js";

export const exams = pgTable(
  "exams",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    subjectId: integer("subject_id")
      .references(() => subjects.id, { onDelete: "cascade" })
      .notNull(),
    classId: integer("class_id").references(() => classes.id),
    questions: jsonb("questions").notNull(),
    totalPoints: real("total_points").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    scheduledAt: timestamp("scheduled_at"),
    status: text("status").default("draft"), // draft, scheduled, active, completed, archived
    createdBy: integer("created_by")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    subjectIdx: index("exams_subject_idx").on(table.subjectId),
    classIdx: index("exams_class_idx").on(table.classId),
    statusIdx: index("exams_status_idx").on(table.status),
    scheduledIdx: index("exams_scheduled_idx").on(table.scheduledAt),
  })
);

export const examResults = pgTable(
  "exam_results",
  {
    id: serial("id").primaryKey(),
    examId: integer("exam_id")
      .references(() => exams.id, { onDelete: "cascade" })
      .notNull(),
    studentId: integer("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    answers: jsonb("answers").notNull(),
    totalScore: real("total_score").notNull(),
    maxScore: real("max_score").notNull(),
    percentage: real("percentage").notNull(),
    startedAt: timestamp("started_at").notNull(),
    completedAt: timestamp("completed_at").notNull(),
    durationTakenMinutes: real("duration_taken_minutes").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    examIdx: index("exam_results_exam_idx").on(table.examId),
    studentIdx: index("exam_results_student_idx").on(table.studentId),
    percentageIdx: index("exam_results_percentage_idx").on(table.percentage),
  })
);

export type Exam = typeof exams.$inferSelect;
export type NewExam = typeof exams.$inferInsert;
export type ExamResult = typeof examResults.$inferSelect;
export type NewExamResult = typeof examResults.$inferInsert;