// =============================================================================
// BuyTuk Academy - Curriculum Contracts
// =============================================================================

export interface CurriculumStandard {
  id: string;
  code: string;
  description: string;
  domain: "arabic" | "english" | "math" | "science";
  grade: string;
  strand: string;
}

export interface LearningObjective {
  id: string;
  standardId: string;
  description: string;
  cognitiveLevel: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
  measurable: boolean;
}

export interface ScopeSequence {
  id: string;
  domain: string;
  grade: string;
  unit: string;
  objectives: string[];
  estimatedWeeks: number;
  prerequisites?: string[] | null;
}

export interface CurriculumMapping {
  objectiveId: string;
  contentId: number;
  contentType: string;
  alignmentStrength: "strong" | "moderate" | "weak";
}