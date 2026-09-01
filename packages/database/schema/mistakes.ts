// =============================================================================
// BuyTuk Academy - Mistakes Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  real,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { attempts } from "./attempts.js";

export const mistakes = pgTable(
  "mistakes",
  {
    id: serial("id").primaryKey(),
    attemptId: integer("attempt_id")
      .references(() => attempts.id, { onDelete: "cascade" })
      .notNull(),
    wordIndex: integer("word_index"),
    expectedWord: text("expected_word"),
    actualWord: text("actual_word"),
    errorType: text("error_type"), // substitution, deletion, insertion
    severity: text("severity"), // high, medium, low
    confidence: real("confidence"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    attemptIdx: index("mistakes_attempt_idx").on(table.attemptId),
    errorTypeIdx: index("mistakes_error_type_idx").on(table.errorType),
  })
);

export type Mistake = typeof mistakes.$inferSelect;
export type NewMistake = typeof mistakes.$inferInsert;