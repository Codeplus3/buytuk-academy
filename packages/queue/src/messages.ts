// =============================================================================
// BuyTuk Academy - Queue Message Types
// =============================================================================

import type { AttemptStatus } from "@buytuk/contracts";

// ===== Analysis Job =====
export interface AnalyzeJob {
  studentId: number;
  passageId: number;
  audioKey: string;
  expectedText: string;
  correlationId: string;
  attemptId?: number;
  priority?: number;
}

export interface AnalyzeResult {
  success: boolean;
  reportId?: number;
  score?: number;
  error?: string;
  duration: number;
}

// ===== Real-time Feedback Job =====
export interface RealtimeFeedbackJob {
  studentId: number;
  passageId: number;
  audioChunk: Buffer;
  timestamp: number;
  correlationId: string;
}

export interface RealtimeFeedbackResult {
  partialTranscript?: string;
  confidence?: number;
  suggestions?: string[];
}

// ===== Notification Job =====
export type NotificationType =
  | "report_ready"
  | "exercise_assigned"
  | "achievement_unlocked"
  | "reminder"
  | "announcement";

export interface NotificationJob {
  userId: number;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  priority?: "high" | "medium" | "low";
}

export interface NotificationResult {
  delivered: boolean;
  channels: string[];
}

// ===== Email Job =====
export type EmailType =
  | "welcome"
  | "password_reset"
  | "report_summary"
  | "weekly_progress"
  | "achievement"
  | "system_notification";

export interface EmailJob {
  to: string;
  type: EmailType;
  subject: string;
  template: string;
  variables: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export interface EmailResult {
  sent: boolean;
  messageId?: string;
}

// ===== Cleanup Job =====
export type CleanupType =
  | "old_audio_files"
  | "expired_sessions"
  | "old_logs"
  | "cache_cleanup";

export interface CleanupJob {
  type: CleanupType;
  olderThanDays: number;
  batchSize?: number;
}

export interface CleanupResult {
  deleted: number;
  errors: number;
}

// ===== Scheduled Task Job =====
export type ScheduledTaskType =
  | "daily_analytics"
  | "weekly_reports"
  | "mastery_evaluation"
  | "cache_refresh";

export interface ScheduledTaskJob {
  type: ScheduledTaskType;
  scheduledAt: Date;
  metadata?: Record<string, any>;
}

export interface ScheduledTaskResult {
  completed: boolean;
  duration: number;
}

// ===== Job Status =====
export type JobStatus =
  | "waiting"
  | "active"
  | "completed"
  | "failed"
  | "delayed"
  | "paused";

export interface JobInfo {
  id: string;
  name: string;
  status: JobStatus;
  progress: number;
  attemptsMade: number;
  timestamp: number;
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
}