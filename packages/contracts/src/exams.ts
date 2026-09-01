// =============================================================================
// BuyTuk Academy - Exams Contracts
// =============================================================================

export type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "essay" | "audio_response";
export type ExamStatus = "draft" | "scheduled" | "active" | "completed" | "archived";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[] | null;
  correctAnswer: string;
  points: number;
  explanation?: string | null;
  audioUrl?: string | null;
}

export interface Exam {
  id: number;
  title: string;
  description?: string | null;
  subjectId: number;
  classId?: number | null;
  questions: Question[];
  totalPoints: number;
  durationMinutes: number;
  scheduledAt?: Date | null;
  status: ExamStatus;
  createdBy: number;
  createdAt: Date;
}

export interface ExamResult {
  id: number;
  examId: number;
  studentId: number;
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    pointsEarned: number;
  }>;
  totalScore: number;
  maxScore: number;
  percentage: number;
  startedAt: Date;
  completedAt: Date;
  durationTakenMinutes: number;
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  subjectId: number;
  classId?: number;
  questions: Omit<Question, "id">[];
  durationMinutes: number;
  scheduledAt?: Date;
}

export interface SubmitExamRequest {
  examId: number;
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
}