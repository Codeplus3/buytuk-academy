// =============================================================================
// BuyTuk Academy - Global Enums
// =============================================================================

export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  PARENT = "parent",
  PRINCIPAL = "principal",
  ADMIN = "admin",
}

export enum AttemptStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum SessionStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  ABANDONED = "abandoned",
}

export enum MasteryLevel {
  MASTERED = "MASTERED",
  PROGRESSING = "PROGRESSING",
  DEVELOPING = "DEVELOPING",
  NEEDS_SUPPORT = "NEEDS_SUPPORT",
}

export enum TrendDirection {
  UP = "up",
  DOWN = "down",
  STABLE = "stable",
}

export enum ErrorSeverity {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum RecommendationPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}