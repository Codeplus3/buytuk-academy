// =============================================================================
// BuyTuk Academy - Wallet Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  real,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const wallets = pgTable(
  "wallets",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    balance: real("balance").default(0),
    currency: text("currency").default("SAR"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    studentIdx: index("wallets_student_idx").on(table.studentId),
  })
);

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    walletId: integer("wallet_id")
      .references(() => wallets.id, { onDelete: "cascade" })
      .notNull(),
    type: text("type").notNull(), // credit, debit, reward, purchase, refund, adjustment
    amount: real("amount").notNull(),
    balanceBefore: real("balance_before").notNull(),
    balanceAfter: real("balance_after").notNull(),
    description: text("description"),
    referenceType: text("reference_type"),
    referenceId: text("reference_id"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    walletIdx: index("transactions_wallet_idx").on(table.walletId),
    typeIdx: index("transactions_type_idx").on(table.type),
  })
);

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

export const pointsTransactions = pgTable("points_transactions", {
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
});

export const rewardItems = pgTable("reward_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cost: integer("cost").notNull(),
  stock: integer("stock").default(0),
  isActive: text("is_active").default("true"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type PointsLedger = typeof pointsLedgers.$inferSelect;
export type NewPointsLedger = typeof pointsLedgers.$inferInsert;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type NewPointsTransaction = typeof pointsTransactions.$inferInsert;
export type RewardItem = typeof rewardItems.$inferSelect;
export type NewRewardItem = typeof rewardItems.$inferInsert;