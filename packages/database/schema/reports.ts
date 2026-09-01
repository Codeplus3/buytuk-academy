// =============================================================================
// BuyTuk Academy - Reports Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  real,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { attempts } from "./attempts.js";

export const reports = pgTable(
  "reports",
  {
    id: serial("id").primaryKey(),
    attemptId: integer("attempt_id")
      .references(() => attempts.id)
      .notNull(),
    score: real("score").notNull(),
    accuracy: real("accuracy"),
    pronunciation: real("pronunciation"),
    fluency: real("fluency"),
    prosody: real("prosody"),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    attemptIdx: uniqueIndex("reports_attempt_idx").on(table.attemptId),
    scoreIdx: index("reports_score_idx").on(table.score),
  })
);

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;