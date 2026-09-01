// =============================================================================
// BuyTuk Academy - Parents Schema
// =============================================================================

import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const parents = pgTable("parents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  displayName: text("display_name"),
  phone: text("phone"),
  relationship: text("relationship"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Parent = typeof parents.$inferSelect;
export type NewParent = typeof parents.$inferInsert;