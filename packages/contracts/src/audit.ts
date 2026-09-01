// =============================================================================
// BuyTuk Academy - Audit Contracts
// =============================================================================

export type AuditAction =
  | "login"
  | "logout"
  | "login_failed"
  | "create_resource"
  | "update_resource"
  | "delete_resource"
  | "view_resource"
  | "submit_attempt"
  | "assign_exercise"
  | "change_role"
  | "system_event";

export interface AuditLog {
  id: number;
  userId?: number | null;
  action: AuditAction;
  resource?: string | null;
  resourceId?: string | null;
  correlationId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
}

export interface AuditQuery {
  userId?: number;
  action?: AuditAction;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface AuditSummary {
  totalEvents: number;
  uniqueUsers: number;
  topActions: Array<{ action: AuditAction; count: number }>;
  recentEvents: AuditLog[];
}