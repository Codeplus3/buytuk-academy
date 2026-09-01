// =============================================================================
// BuyTuk Academy - Teacher Contracts
// =============================================================================

export interface Teacher {
  id: number;
  userId: number;
  displayName?: string | null;
  bio?: string | null;
  specialization?: string | null;
  createdAt: Date;
}

export interface TeacherSummary {
  id: number;
  displayName?: string | null;
  specialization?: string | null;
  totalStudents: number;
  totalClasses: number;
  totalPassages: number;
}

export interface TeacherClass {
  teacherId: number;
  classId: number;
  role: "owner" | "co-teacher";
  assignedAt: Date;
}