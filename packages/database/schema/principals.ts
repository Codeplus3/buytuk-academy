// =============================================================================
// BuyTuk Academy - Principals Schema
// =============================================================================

import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const principals = pgTable("principals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  displayName: text("display_name"),
  schoolName: text("school_name"),
  schoolCode: text("school_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Principal = typeof principals.$inferSelect;
export type NewPrincipal = typeof principals.$inferInsert;