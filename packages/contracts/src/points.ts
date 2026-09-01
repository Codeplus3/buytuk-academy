// =============================================================================
// BuyTuk Academy - Points Contracts
// =============================================================================

export interface PointsLedger {
  id: number;
  studentId: number;
  totalPoints: number;
  spentPoints: number;
  availablePoints: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PointsTransaction {
  id: number;
  studentId: number;
  type: "earned" | "spent" | "expired" | "adjusted";
  amount: number;
  reason: string;
  referenceType?: string | null;
  referenceId?: string | null;
  expiresAt?: Date | null;
  createdAt: Date;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string | null;
}

export interface RedeemRewardRequest {
  studentId: number;
  rewardId: string;
}

export interface PointsSummary {
  studentId: number;
  totalPoints: number;
  availablePoints: number;
  level: number;
  nextLevelAt: number;
  recentTransactions: PointsTransaction[];
}