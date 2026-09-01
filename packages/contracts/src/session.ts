// =============================================================================
// BuyTuk Academy - Session Contracts
// =============================================================================

import { SessionStatus } from "./enums.js";

export interface Session {
  id: number;
  studentId: number;
  passageId?: number | null;
  lessonId?: number | null;
  startedAt: Date;
  endedAt?: Date | null;
  status: SessionStatus;
  metadata?: Record<string, any> | null;
}

export interface SessionSummary {
  id: number;
  studentId: number;
  startedAt: Date;
  durationSeconds?: number | null;
  status: SessionStatus;
  attemptsCount: number;
}

export interface CreateSessionRequest {
  studentId: number;
  passageId?: number;
  lessonId?: number;
}

export interface UpdateSessionRequest {
  status?: SessionStatus;
  endedAt?: Date;
  metadata?: Record<string, any>;
}