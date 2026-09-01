// =============================================================================
// BuyTuk Academy - Content Contracts
// =============================================================================

export type ContentType =
  | "passage"
  | "lesson"
  | "exercise"
  | "quiz"
  | "video"
  | "audio";

export type ContentStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "published"
  | "archived";

export interface Content {
  id: number;
  type: ContentType;
  title: string;
  body?: string | null;
  metadata?: Record<string, any> | null;
  status: ContentStatus;
  version: number;
  createdBy: number;
  approvedBy?: number | null;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContentRequest {
  type: ContentType;
  title: string;
  body?: string;
  metadata?: Record<string, any>;
}

export interface UpdateContentRequest {
  title?: string;
  body?: string;
  metadata?: Record<string, any>;
  status?: ContentStatus;
}

export interface ContentVersion {
  id: number;
  contentId: number;
  version: number;
  body: string;
  metadata?: Record<string, any> | null;
  createdBy: number;
  createdAt: Date;
}