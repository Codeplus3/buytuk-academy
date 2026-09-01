// =============================================================================
// BuyTuk Academy - Phoneme Errors Schema
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
import { mistakes } from "./mistakes.js";

export const phonemeErrors = pgTable(
  "phoneme_errors",
  {
    id: serial("id").primaryKey(),
    mistakeId: integer("mistake_id")
      .references(() => mistakes.id, { onDelete: "cascade" })
      .notNull(),
    expected: text("expected"),
    actual: text("actual"),
    phoneticDistance: real("phonetic_distance"),
    position: integer("position"),
    severity: text("severity"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    mistakeIdx: index("phoneme_errors_mistake_idx").on(table.mistakeId),
  })
);

export type PhonemeError = typeof phonemeErrors.$inferSelect;
export type NewPhonemeError = typeof phonemeErrors.$inferInsert;