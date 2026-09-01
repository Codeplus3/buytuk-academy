// =============================================================================
// BuyTuk Academy - Transactions Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  real,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { wallets } from "./wallet.js";

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
    createdAtIdx: index("transactions_created_at_idx").on(table.createdAt),
  })
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;