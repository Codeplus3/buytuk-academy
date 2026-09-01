// =============================================================================
// BuyTuk Academy - Analytics Contracts
// =============================================================================

export interface DailyAnalytics {
  id: number;
  studentId: number;
  date: Date;
  totalAttempts: number;
  avgScore: number | null;
  totalPracticeMin: number | null;
  masteredPassages: number;
  topErrors?: Record<string, number> | null;
  createdAt: Date;
}

export interface StudentAnalytics {
  studentId: number;
  totalAttempts: number;
  averageScore: number;
  totalPracticeHours: number;
  masteryProgression: Array<{
    date: Date;
    level: string;
    score: number;
  }>;
  topProblemAreas: Array<{
    area: string;
    errorCount: number;
  }>;
  trend: "improving" | "stable" | "declining";
}

export interface ClassAnalytics {
  classId: number;
  studentCount: number;
  averageScore: number;
  completionRate: number;
  topPerformers: Array<{
    studentId: number;
    score: number;
  }>;
  studentsAtRisk: Array<{
    studentId: number;
    score: number;
  }>;
}

export interface PlatformAnalytics {
  totalStudents: number;
  totalTeachers: number;
  totalAttempts: number;
  averageScore: number;
  activeToday: number;
  growthRate: number;
}