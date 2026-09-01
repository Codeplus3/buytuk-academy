// =============================================================================
// BuyTuk Academy - Audit Log Schema
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    action: text("action").notNull(), // login, logout, login_failed, create_resource, update_resource, delete_resource, view_resource, submit_attempt, assign_exercise, change_role, system_event
    resource: text("resource"),
    resourceId: text("resource_id"),
    correlationId: text("correlation_id"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("audit_log_user_idx").on(table.userId),
    actionIdx: index("audit_log_action_idx").on(table.action),
    resourceIdx: index("audit_log_resource_idx").on(table.resource),
    createdAtIdx: index("audit_log_created_at_idx").on(table.createdAt),
    correlationIdx: index("audit_log_correlation_idx").on(table.correlationId),
  })
);

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;