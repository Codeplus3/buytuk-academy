// =============================================================================
// BuyTuk Academy - Content Schema
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

export const content = pgTable(
  "content",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull(), // passage, lesson, exercise, quiz, video, audio
    title: text("title").notNull(),
    body: text("body"),
    metadata: jsonb("metadata"),
    status: text("status").default("draft"), // draft, pending_review, approved, published, archived
    version: integer("version").default(1),
    createdBy: integer("created_by")
      .references(() => users.id)
      .notNull(),
    approvedBy: integer("approved_by").references(() => users.id),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    typeIdx: index("content_type_idx").on(table.type),
    statusIdx: index("content_status_idx").on(table.status),
    createdByIdx: index("content_created_by_idx").on(table.createdBy),
  })
);

export const contentVersions = pgTable("content_versions", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id")
    .references(() => content.id, { onDelete: "cascade" })
    .notNull(),
  version: integer("version").notNull(),
  body: text("body").notNull(),
  metadata: jsonb("metadata"),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
export type ContentVersion = typeof contentVersions.$inferSelect;
export type NewContentVersion = typeof contentVersions.$inferInsert;