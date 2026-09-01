// =============================================================================
// BuyTuk Academy - Students Schema
// =============================================================================

import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const students = pgTable(
  "students",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    displayName: text("display_name"),
    grade: text("grade"),
    nativeLanguage: text("native_language"),
    learningDisabilities: jsonb("learning_disabilities"),
    parentContact: text("parent_contact"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("students_user_id_idx").on(table.userId),
  })
);

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;