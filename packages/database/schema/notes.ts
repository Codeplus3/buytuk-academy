// =============================================================================
// BuyTuk Academy - Notes Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    authorId: integer("author_id")
      .references(() => users.id)
      .notNull(),
    authorRole: text("author_role").notNull(),
    type: text("type").notNull(), // personal, academic, behavioral, general
    title: text("title"),
    content: text("content").notNull(),
    visibility: text("visibility").default("private"), // private, teacher, parent, public
    isPinned: boolean("is_pinned").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    studentIdx: index("notes_student_idx").on(table.studentId),
    authorIdx: index("notes_author_idx").on(table.authorId),
    typeIdx: index("notes_type_idx").on(table.type),
    visibilityIdx: index("notes_visibility_idx").on(table.visibility),
  })
);

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;