// =============================================================================
// BuyTuk Academy - Attempt Contracts
// =============================================================================

import { AttemptStatus } from "./enums.js";

export interface Attempt {
  id: number;
  sessionId: number;
  studentId: number;
  passageId: number;
  audioFileId?: string | null;
  transcript?: string | null;
  durationSec?: number | null;
  wordCount?: number | null;
  status: AttemptStatus;
  correlationId?: string | null;
  createdAt: Date;
}

export interface AttemptSummary {
  id: number;
  passageId: number;
  passageTitle?: string | null;
  status: AttemptStatus;
  score?: number | null;
  createdAt: Date;
}

export interface CreateAttemptRequest {
  sessionId: number;
  passageId: number;
  audioFileId?: string;
}

export interface ConfirmAttemptRequest {
  audioKey: string;
  expectedText: string;
}

export interface AttemptWithReport extends Attempt {
  report?: {
    id: number;
    score: number;
    accuracy?: number | null;
    pronunciation?: number | null;
    fluency?: number | null;
    prosody?: number | null;
  } | null;
}