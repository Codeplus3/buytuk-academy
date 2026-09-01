// =============================================================================
// BuyTuk Academy - Student Contracts
// =============================================================================

import { MasteryLevel, TrendDirection } from "./enums.js";

export interface Student {
  id: number;
  userId: number;
  displayName?: string | null;
  grade?: string | null;
  nativeLanguage?: string | null;
  learningDisabilities?: Record<string, any> | null;
  parentContact?: string | null;
  createdAt: Date;
}

export interface StudentSummary {
  id: number;
  displayName?: string | null;
  grade?: string | null;
  currentMasteryLevel?: MasteryLevel | null;
  trend?: TrendDirection | null;
  lastActivityAt?: Date | null;
}

export interface StudentProgress {
  studentId: number;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  masteryLevel: MasteryLevel;
  trend: TrendDirection;
  lastUpdated: Date;
}

export interface StudentClass {
  studentId: number;
  classId: number;
  enrolledAt: Date;
  status: "active" | "inactive";
}