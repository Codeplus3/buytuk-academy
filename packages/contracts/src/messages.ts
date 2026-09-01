// =============================================================================
// BuyTuk Academy - Messages Contracts
// =============================================================================

export type MessageType = "direct" | "announcement" | "system" | "notification";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: number;
  type: MessageType;
  senderId: number;
  recipientId?: number | null;
  recipientRole?: string | null;
  subject?: string | null;
  body: string;
  metadata?: Record<string, any> | null;
  isRead: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: number;
  participants: number[];
  lastMessage?: Message | null;
  unreadCount: number;
  updatedAt: Date;
}

export interface SendMessageRequest {
  type: MessageType;
  recipientId?: number;
  recipientRole?: string;
  subject?: string;
  body: string;
  metadata?: Record<string, any>;
}

export interface MessageSummary {
  id: number;
  type: MessageType;
  senderName?: string | null;
  subject?: string | null;
  preview: string;
  isRead: boolean;
  createdAt: Date;
}