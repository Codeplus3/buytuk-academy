// =============================================================================
// BuyTuk Academy - Principal Contracts
// =============================================================================

export interface Principal {
  id: number;
  userId: number;
  displayName?: string | null;
  schoolName?: string | null;
  schoolCode?: string | null;
  createdAt: Date;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  averageScore: number;
  activeStudents: number;
}

export interface PrincipalDashboard {
  schoolStats: SchoolStats;
  topPerformingStudents: Array<{
    studentId: number;
    displayName?: string | null;
    score: number;
  }>;
  studentsNeedingSupport: Array<{
    studentId: number;
    displayName?: string | null;
    score: number;
  }>;
}