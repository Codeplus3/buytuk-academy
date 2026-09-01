// =============================================================================
// BuyTuk Academy - Classes Schema
// =============================================================================

import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { teachers } from "./teachers.js";

export const classes = pgTable(
  "classes",
  {
    id: serial("id").primaryKey(),
    teacherId: integer("teacher_id").references(() => teachers.id),
    name: text("name").notNull(),
    code: text("code").unique(),
    grade: text("grade"),
    academicYear: text("academic_year"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    codeIdx: uniqueIndex("classes_code_idx").on(table.code),
    teacherIdx: index("classes_teacher_idx").on(table.teacherId),
  })
);

export const classStudents = pgTable(
  "class_students",
  {
    id: serial("id").primaryKey(),
    classId: integer("class_id")
      .references(() => classes.id, { onDelete: "cascade" })
      .notNull(),
    studentId: integer("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    enrolledAt: timestamp("enrolled_at").defaultNow(),
    status: text("status").default("active"),
  },
  (table) => ({
    uniqueEnrollment: uniqueIndex("class_students_unique_idx").on(
      table.classId,
      table.studentId
    ),
  })
);

export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type ClassStudent = typeof classStudents.$inferSelect;
export type NewClassStudent = typeof classStudents.$inferInsert;