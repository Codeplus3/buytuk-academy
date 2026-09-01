// =============================================================================
// BuyTuk Academy - Class Contracts
// =============================================================================

export interface Class {
  id: number;
  teacherId: number;
  name: string;
  code?: string | null;
  grade?: string | null;
  academicYear?: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface ClassWithStats extends Class {
  studentCount: number;
  averageScore: number;
  totalAttempts: number;
}

export interface Enrollment {
  id: number;
  classId: number;
  studentId: number;
  enrolledAt: Date;
  status: "active" | "inactive";
}

export interface CreateClassRequest {
  name: string;
  grade?: string;
  academicYear?: string;
}

export interface UpdateClassRequest {
  name?: string;
  grade?: string;
  academicYear?: string;
  isActive?: boolean;
}