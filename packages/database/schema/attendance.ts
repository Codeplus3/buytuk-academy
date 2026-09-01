// =============================================================================
// BuyTuk Academy - Attendance Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { classes } from "./classes.js";

export const attendanceRecords = pgTable(
  "attendance_records",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    classId: integer("class_id")
      .references(() => classes.id, { onDelete: "cascade" })
      .notNull(),
    date: timestamp("date", { mode: "date" }).notNull(),
    status: text("status").notNull(), // present, absent, late, excused
    checkInTime: timestamp("check_in_time"),
    checkOutTime: timestamp("check_out_time"),
    notes: text("notes"),
    markedBy: integer("marked_by")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    studentIdx: index("attendance_records_student_idx").on(table.studentId),
    classIdx: index("attendance_records_class_idx").on(table.classId),
    dateIdx: index("attendance_records_date_idx").on(table.date),
    statusIdx: index("attendance_records_status_idx").on(table.status),
    uniqueRecord: uniqueIndex("attendance_unique_idx").on(
      table.studentId,
      table.classId,
      table.date
    ),
  })
);

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type NewAttendanceRecord = typeof attendanceRecords.$inferInsert;