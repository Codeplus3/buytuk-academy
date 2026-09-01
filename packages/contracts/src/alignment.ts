// =============================================================================
// BuyTuk Academy - Alignment Contracts
// =============================================================================

import { ErrorSeverity } from "./enums.js";
import type { PhonemeError } from "./phoneme.js";

export type AlignmentOpType =
  | "match"
  | "substitution"
  | "deletion"
  | "insertion"
  | "repeat"
  | "skip_line";

export interface AlignmentOp {
  type: AlignmentOpType;
  expected?: string | null;
  actual?: string | null;
  cost: number;
  confidence?: number | null;
  phonemeErrors?: PhonemeError[] | null;
}

export interface DTWResult {
  ops: AlignmentOp[];
  distance: number;
  normalizedDistance: number;
}

export interface AlignmentResult {
  wordOps: AlignmentOp[];
  phonemeOps: AlignmentOp[];
  wordErrorRate: number;
  phonemeErrorRate: number;
  totalErrors: number;
}

export interface WordAlignment {
  word: string;
  start: number;
  end: number;
  score: number;
  confidence: number;
  phonemeAlignment?: {
    expected: string[];
    actual: string[];
    errors: PhonemeError[];
    score: number;
  } | null;
}

export interface AIFeedback {
  exerciseId: string;
  originalInstructions: string;
  personalizedInstructions: string;
  errorExplanation: string;
  rootCause: string;
  treatmentPlan?: string[] | null;
}