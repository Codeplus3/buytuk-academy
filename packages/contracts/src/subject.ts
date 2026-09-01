// =============================================================================
// BuyTuk Academy - Subject Contracts
// =============================================================================

export interface Subject {
  id: number;
  name: string;
  code: string;
  domain: "arabic" | "english" | "math" | "science";
  grade?: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface SubjectSummary {
  id: number;
  name: string;
  code: string;
  domain: string;
  totalLessons: number;
  totalStudents: number;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  domain: "arabic" | "english" | "math" | "science";
  grade?: string;
}