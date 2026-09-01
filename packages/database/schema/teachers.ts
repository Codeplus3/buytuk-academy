// =============================================================================
// BuyTuk Academy - Teachers Schema
// =============================================================================

import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  specialization: text("specialization"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Teacher = typeof teachers.$inferSelect;
export type NewTeacher = typeof teachers.$inferInsert;