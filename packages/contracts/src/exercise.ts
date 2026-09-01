// =============================================================================
// BuyTuk Academy - Exercise Contracts
// =============================================================================

export type ExerciseType =
  | "minimal_pairs"
  | "tongue_twister"
  | "syllable_drill"
  | "contextual_reading";

export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  focus: string[];
  content: Record<string, any>;
  instructions: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  isActive: boolean;
  createdAt: Date;
}

export interface StudentExercise {
  id: number;
  studentId: number;
  exerciseId: string;
  status: "pending" | "in_progress" | "completed";
  assignedAt: Date;
  completedAt?: Date | null;
  assignedByReportId?: number | null;
  assignedByTeacherId?: number | null;
}

export interface ExerciseAttempt {
  id: number;
  studentExerciseId: number;
  audioFileId?: string | null;
  score?: number | null;
  data?: Record<string, any> | null;
  createdAt: Date;
}

export interface CreateExerciseRequest {
  type: ExerciseType;
  title: string;
  focus: string[];
  content: Record<string, any>;
  instructions: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface AssignExerciseRequest {
  studentId: number;
  exerciseId: string;
  reportId?: number;
}