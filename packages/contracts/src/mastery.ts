// =============================================================================
// BuyTuk Academy - Mastery Contracts
// =============================================================================

import { MasteryLevel, TrendDirection } from "./enums.js";

export interface MasteryHistory {
  id: number;
  studentId: number;
  passageId: number;
  attemptId?: number | null;
  score: number;
  level: MasteryLevel;
  delta: number;
  trend?: TrendDirection | null;
  createdAt: Date;
}

export interface MasterySummary {
  studentId: number;
  passageId: number;
  currentLevel: MasteryLevel;
  currentScore: number;
  trend: TrendDirection;
  totalAttempts: number;
  lastUpdated: Date;
}

export interface MasteryProgress {
  studentId: number;
  passages: Array<{
    passageId: number;
    passageTitle?: string | null;
    level: MasteryLevel;
    score: number;
    trend: TrendDirection;
  }>;
  overallLevel: MasteryLevel;
  overallScore: number;
}

export interface CreateMasteryRecordRequest {
  studentId: number;
  passageId: number;
  attemptId?: number;
  score: number;
  level: MasteryLevel;
  delta: number;
  trend?: TrendDirection;
}