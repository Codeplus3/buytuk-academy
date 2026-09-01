// =============================================================================
// BuyTuk Academy - Wallet Contracts
// =============================================================================

export type TransactionType =
  | "credit"
  | "debit"
  | "reward"
  | "purchase"
  | "refund"
  | "adjustment";

export interface Wallet {
  id: number;
  studentId: number;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: number;
  walletId: number;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
  createdAt: Date;
}

export interface CreateTransactionRequest {
  walletId: number;
  type: TransactionType;
  amount: number;
  description?: string;
  referenceType?: string;
  referenceId?: string;
}

export interface WalletSummary {
  walletId: number;
  balance: number;
  currency: string;
  totalCredits: number;
  totalDebits: number;
  transactionCount: number;
  lastTransactionAt?: Date | null;
}