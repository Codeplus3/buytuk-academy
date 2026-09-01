// =============================================================================
// BuyTuk Academy - Points Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const pointsLedgers = pgTable(
  "points_ledgers",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    totalPoints: integer("total_points").default(0),
    spentPoints: integer("spent_points").default(0),
    availablePoints: integer("available_points").default(0),
    level: integer("level").default(1),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    studentIdx: index("points_ledgers_student_idx").on(table.studentId),
  })
);

export const pointsTransactions = pgTable(
  "points_transactions",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    type: text("type").notNull(), // earned, spent, expired, adjusted
    amount: integer("amount").notNull(),
    reason: text("reason").notNull(),
    referenceType: text("reference_type"),
    referenceId: text("reference_id"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    studentIdx: index("points_transactions_student_idx").on(table.studentId),
    typeIdx: index("points_transactions_type_idx").on(table.type),
  })
);

export const rewardItems = pgTable(
  "reward_items",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    cost: integer("cost").notNull(),
    stock: integer("stock").default(0),
    isActive: text("is_active").default("true"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    isActiveIdx: index("reward_items_active_idx").on(table.isActive),
  })
);

export type PointsLedger = typeof pointsLedgers.$inferSelect;
export type NewPointsLedger = typeof pointsLedgers.$inferInsert;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type NewPointsTransaction = typeof pointsTransactions.$inferInsert;
export type RewardItem = typeof rewardItems.$inferSelect;
export type NewRewardItem = typeof rewardItems.$inferInsert;