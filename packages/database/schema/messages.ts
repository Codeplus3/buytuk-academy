// =============================================================================
// BuyTuk Academy - Messages Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  jsonb,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull(), // direct, announcement, system, notification
    senderId: integer("sender_id")
      .references(() => users.id)
      .notNull(),
    recipientId: integer("recipient_id").references(() => users.id),
    recipientRole: text("recipient_role"),
    subject: text("subject"),
    body: text("body").notNull(),
    metadata: jsonb("metadata"),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    senderIdx: index("messages_sender_idx").on(table.senderId),
    recipientIdx: index("messages_recipient_idx").on(table.recipientId),
    typeIdx: index("messages_type_idx").on(table.type),
    isReadIdx: index("messages_is_read_idx").on(table.isRead),
  })
);

export const conversations = pgTable(
  "conversations",
  {
    id: serial("id").primaryKey(),
    participantIds: jsonb("participant_ids").notNull(),
    lastMessageId: integer("last_message_id").references(() => messages.id),
    unreadCount: integer("unread_count").default(0),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    updatedAtIdx: index("conversations_updated_at_idx").on(table.updatedAt),
  })
);

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;