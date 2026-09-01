// =============================================================================
// BuyTuk Academy - Exercises Schema
// =============================================================================

import {
  pgTable,
  text,
  integer,
  jsonb,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const exercises = pgTable(
  "exercises",
  {
    id: text("id").primaryKey(), // e.g., "mp-th-sin"
    type: text("type").notNull(), // minimal_pairs, tongue_twister, syllable_drill, contextual_reading
    title: text("title").notNull(),
    focus: jsonb("focus").notNull(), // ["θ", "s"]
    content: jsonb("content").notNull(),
    instructions: text("instructions"),
    difficulty: integer("difficulty").default(1),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    typeIdx: index("exercises_type_idx").on(table.type),
    difficultyIdx: index("exercises_difficulty_idx").on(table.difficulty),
  })
);

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;