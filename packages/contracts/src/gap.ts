// =============================================================================
// BuyTuk Academy - Gap Detection Contracts
// =============================================================================

import { ErrorSeverity } from "./enums.js";

export interface GapResult {
  errorDistribution: Record<string, number>;
  phonemeGaps: Record<string, number>;
  problemWords: string[];
  skippedSegments: string[];
  severityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface PhonemeConfusion {
  expected: string;
  actual: string;
  count: number;
  severity: ErrorSeverity;
}

export interface GapAnalysis {
  totalErrors: number;
  errorRate: number;
  topConfusions: PhonemeConfusion[];
  problemPhonemes: string[];
  recommendedExercises: string[];
}

export function calculateSeverityBreakdown(
  errors: Array<{ severity: ErrorSeverity }>
): { high: number; medium: number; low: number } {
  return {
    high: errors.filter((e) => e.severity === ErrorSeverity.HIGH).length,
    medium: errors.filter((e) => e.severity === ErrorSeverity.MEDIUM).length,
    low: errors.filter((e) => e.severity === ErrorSeverity.LOW).length,
  };
}