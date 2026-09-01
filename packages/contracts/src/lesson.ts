// =============================================================================
// BuyTuk Academy - Lesson Contracts
// =============================================================================

export interface Lesson {
  id: number;
  subjectId: number;
  title: string;
  description?: string | null;
  order: number;
  durationMinutes?: number | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  isActive: boolean;
  createdAt: Date;
}

export interface LessonWithContent extends Lesson {
  content?: string | null;
  exercises?: number;
  estimatedCompletionTime?: number | null;
}

export interface CreateLessonRequest {
  subjectId: number;
  title: string;
  description?: string;
  order: number;
  durationMinutes?: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface UpdateLessonRequest {
  title?: string;
  description?: string;
  order?: number;
  durationMinutes?: number;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  isActive?: boolean;
}