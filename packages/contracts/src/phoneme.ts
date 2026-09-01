// =============================================================================
// BuyTuk Academy - Phoneme Contracts
// =============================================================================

import { ErrorSeverity } from "./enums.js";

export type PhonemeStatus = "correct" | "wrong" | "missing" | "extra";

export interface PhonemeError {
  type: "substitution" | "deletion" | "insertion";
  expected?: string | null;
  actual?: string | null;
  position: number;
  phoneticDistance: number;
  severity: ErrorSeverity;
}

export interface PhonemeTimestamp {
  phoneme: string;
  start: number;
  end: number;
  confidence: number;
}

export interface PhonemeAlignment {
  expected: string[];
  actual: string[];
  errors: PhonemeError[];
  score: number;
}

export interface PhonemeReportItem {
  phoneme: string;
  status: PhonemeStatus;
  actual?: string | null;
  confidence?: number | null;
  durationMs?: number | null;
  articulationNote?: string | null;
  phoneticDistance?: number | null;
}

export interface WordReportItem {
  word: string;
  status: "correct" | "wrong" | "missing" | "extra" | "repeated" | "skipped";
  actual?: string | null;
  confidence?: number | null;
  durationMs?: number | null;
  expectedDurationMs?: number | null;
  phonemeReport?: PhonemeReportItem[] | null;
}