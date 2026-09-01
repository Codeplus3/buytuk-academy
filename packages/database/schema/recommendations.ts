// =============================================================================
// BuyTuk Academy - Recommendations Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { reports } from "./reports.js";

export const recommendations = pgTable(
  "recommendations",
  {
    id: serial("id").primaryKey(),
    reportId: integer("report_id")
      .references(() => reports.id, { onDelete: "cascade" })
      .notNull(),
    category: text("category").notNull(), // fluency, accuracy, pronunciation, prosody, engagement
    message: text("message").notNull(),
    priority: text("priority").notNull(), // high, medium, low
    exerciseId: text("exercise_id"),
    seen: boolean("seen").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    reportIdx: index("recommendations_report_idx").on(table.reportId),
    priorityIdx: index("recommendations_priority_idx").on(table.priority),
  })
);

export type Recommendation = typeof recommendations.$inferSelect;
export type NewRecommendation = typeof recommendations.$inferInsert;