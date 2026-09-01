// =============================================================================
// BuyTuk Academy - Scoring Contracts
// =============================================================================

export interface ScoringWeights {
  accuracy: number;
  pronunciation: number;
  fluency: number;
  prosody: number;
}

export interface ScoringThresholds {
  excellent: number;
  good: number;
  passing: number;
  needsImprovement: number;
}

export interface ScoreBreakdown {
  overall: number;
  accuracy: number;
  pronunciation: number;
  fluency: number;
  prosody: number;
  wpm: number;
  durationSec: number;
}

export interface ScoreLabel {
  label: string;
  color: string;
  minScore: number;
  maxScore: number;
}

export const SCORE_LABELS: ScoreLabel[] = [
  { label: "ممتاز", color: "#10b981", minScore: 85, maxScore: 100 },
  { label: "جيد جداً", color: "#3b82f6", minScore: 70, maxScore: 84 },
  { label: "جيد", color: "#f59e0b", minScore: 50, maxScore: 69 },
  { label: "يحتاج تحسين", color: "#ef4444", minScore: 0, maxScore: 49 },
];

export function getScoreLabel(score: number): ScoreLabel {
  return (
    SCORE_LABELS.find((l) => score >= l.minScore && score <= l.maxScore) ||
    SCORE_LABELS[SCORE_LABELS.length - 1]
  );
}