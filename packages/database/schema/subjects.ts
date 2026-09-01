// =============================================================================
// BuyTuk Academy - Subjects Schema
// =============================================================================

import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const subjects = pgTable(
  "subjects",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    domain: text("domain").notNull(), // arabic, english, math, science
    grade: text("grade"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    codeIdx: index("subjects_code_idx").on(table.code),
    domainIdx: index("subjects_domain_idx").on(table.domain),
  })
);

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;