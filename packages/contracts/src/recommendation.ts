// =============================================================================
// BuyTuk Academy - Recommendation Contracts
// =============================================================================

import { RecommendationPriority } from "./enums.js";

export type RecommendationCategory =
  | "fluency"
  | "accuracy"
  | "pronunciation"
  | "prosody"
  | "engagement"
  | "mastery";

export interface Recommendation {
  id?: number;
  category: RecommendationCategory;
  message: string;
  priority: RecommendationPriority;
  exerciseId?: string | null;
  seen?: boolean;
  createdAt?: Date;
}

export interface RecommendationRequest {
  score: {
    accuracy: number;
    pronunciation: number;
    fluency: number;
    prosody: number;
  };
  gaps: {
    problemWords: string[];
    phonemeGaps: Record<string, number>;
    severityBreakdown: { high: number; medium: number; low: number };
  };
  mastery: {
    level: string;
    trend: string;
    attempts: number;
  };
}

export const PRIORITY_ORDER: Record<RecommendationPriority, number> = {
  [RecommendationPriority.HIGH]: 0,
  [RecommendationPriority.MEDIUM]: 1,
  [RecommendationPriority.LOW]: 2,
};

export function sortRecommendationsByPriority(
  recs: Recommendation[]
): Recommendation[] {
  return [...recs].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}