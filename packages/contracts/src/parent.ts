// =============================================================================
// BuyTuk Academy - Parent Contracts
// =============================================================================

export interface Parent {
  id: number;
  userId: number;
  displayName?: string | null;
  phone?: string | null;
  relationship?: string | null;
  createdAt: Date;
}

export interface ParentChild {
  parentId: number;
  studentId: number;
  relationship: string;
  canViewReports: boolean;
  canViewExercises: boolean;
  canReceiveNotifications: boolean;
}

export interface ParentDashboard {
  children: Array<{
    studentId: number;
    displayName?: string | null;
    grade?: string | null;
    currentMasteryLevel?: string | null;
    recentScore?: number | null;
  }>;
  totalChildren: number;
}