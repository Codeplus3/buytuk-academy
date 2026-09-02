// =============================================================================
// BuyTuk Academy - Report Contracts
// =============================================================================

import { MasteryLevel, TrendDirection } from "./enums.js";
import type { WordReportItem } from "./phoneme.js";
import type { GapResult } from "./gap.js";
import type { Recommendation } from "./recommendation.js";
import type { AIFeedback } from "./alignment.js";

export interface ReadingScore {
  overall: number;
  accuracy: number;
  pronunciation: number;
  fluency: number;
  prosody: number;
  wpm: number;
  durationSec: number;
}

export interface MasteryResult {
  level: MasteryLevel;
  delta: number;
  attempts: number;
  trend: TrendDirection;
}

export interface FullReport {
  id: number;
  attemptId: number;
  studentId: number;
  passageId: number;
  expected: string;
  actual: string;
  wordReport: WordReportItem[];
  reading: ReadingScore;
  mastery: MasteryResult;
  gaps: GapResult;
  recommendations: Recommendation[];
  aiFeedback: AIFeedback[];
  modelVersions: {
    whisper: string;
    alignment: string;
    g2p: string;
  };
  createdAt: Date;
}

export interface ReportSummary {
  id: number;
  attemptId: number;
  score: number;
  accuracy?: number | null;
  pronunciation?: number | null;
  fluency?: number | null;
  prosody?: number | null;
  createdAt: Date;
}

export interface CreateReportRequest {
  attemptId: number;
  score: number;
  data: Omit<FullReport, "id" | "attemptId" | "createdAt">;
}