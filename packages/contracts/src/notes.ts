// =============================================================================
// BuyTuk Academy - Notes Contracts
// =============================================================================

export type NoteType = "personal" | "academic" | "behavioral" | "general";
export type NoteVisibility = "private" | "teacher" | "parent" | "public";

export interface Note {
  id: number;
  studentId: number;
  authorId: number;
  authorRole: string;
  type: NoteType;
  title?: string | null;
  content: string;
  visibility: NoteVisibility;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteRequest {
  studentId: number;
  type: NoteType;
  title?: string;
  content: string;
  visibility?: NoteVisibility;
  isPinned?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  visibility?: NoteVisibility;
  isPinned?: boolean;
}

export interface NoteSummary {
  id: number;
  title?: string | null;
  type: NoteType;
  authorName?: string | null;
  isPinned: boolean;
  updatedAt: Date;
}