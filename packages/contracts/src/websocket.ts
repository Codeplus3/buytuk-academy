// =============================================================================
// BuyTuk Academy - WebSocket Contracts
// =============================================================================

import type { AttemptStatus, SessionStatus } from "./enums.js";

// ===== Client -> Server Events =====
export interface ClientToServerEvents {
  start_session: {
    passageId: number;
    expectedText: string;
  };
  audio_chunk: ArrayBuffer;
  stop_session: void;
  join_room: { room: string };
  leave_room: { room: string };
}

// ===== Server -> Client Events =====
export interface ServerToClientEvents {
  session_started: {
    ok: boolean;
    sessionId: number;
    attemptId: number;
    correlationId: string;
  };
  session_error: {
    message: string;
    code: string;
  };
  recording_progress: {
    durationSec: number;
    bytesReceived: number;
  };
  pipeline_status: {
    stage: string;
    progress: number;
  };
  session_stopped: {
    ok: boolean;
    jobId: string;
    message: string;
  };
  report_ready: {
    reportId: number;
    score: number;
  };
  notification: {
    type: string;
    title: string;
    body: string;
    data?: Record<string, any>;
  };
}

// ===== Socket Auth Payload =====
export interface SocketAuthPayload {
  token: string;
}

// ===== Room Names =====
export const SOCKET_ROOMS = {
  user: (userId: number) => `user:${userId}`,
  session: (sessionId: number) => `session:${sessionId}`,
  class: (classId: number) => `class:${classId}`,
  global: "global",
} as const;