// =============================================================================
// BuyTuk Academy - Analytics Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  real,
  text,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const analytics = pgTable(
  "analytics",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    date: timestamp("date", { mode: "date" }).notNull(),
    totalAttempts: integer("total_attempts").default(0),
    avgScore: real("avg_score"),
    totalPracticeMin: real("total_practice_min"),
    masteredPassages: integer("mastered_passages").default(0),
    topErrors: jsonb("top_errors"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    studentDateIdx: uniqueIndex("analytics_student_date_idx").on(
      table.studentId,
      table.date
    ),
    dateIdx: index("analytics_date_idx").on(table.date),
    avgScoreIdx: index("analytics_avg_score_idx").on(table.avgScore),
  })
);

export const platformAnalytics = pgTable(
  "platform_analytics",
  {
    id: serial("id").primaryKey(),
    date: timestamp("date", { mode: "date" }).notNull(),
    totalStudents: integer("total_students").default(0),
    totalTeachers: integer("total_teachers").default(0),
    totalAttempts: integer("total_attempts").default(0),
    averageScore: real("average_score"),
    activeToday: integer("active_today").default(0),
    growthRate: real("growth_rate"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    dateIdx: uniqueIndex("platform_analytics_date_idx").on(table.date),
  })
);

export type Analytics = typeof analytics.$inferSelect;
export type NewAnalytics = typeof analytics.$inferInsert;
export type PlatformAnalytics = typeof platformAnalytics.$inferSelect;
export type NewPlatformAnalytics = typeof platformAnalytics.$inferInsert;