import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import type {
  AnalyzeJob,
  AnalyzeResult,
  CleanupJob,
  CleanupResult,
  EmailJob,
  EmailResult,
  NotificationJob,
  NotificationResult,
  RealtimeFeedbackJob,
  RealtimeFeedbackResult,
  ScheduledTaskJob,
  ScheduledTaskResult,
} from "@buytuk/queue";
import { logger } from "@buytuk/observability";
import { transcribeAudio } from "./inference-client.js";

async function loadAudio(audioKey: string): Promise<Buffer> {
  const baseUrl = process.env.AUDIO_BASE_URL;
  if (!baseUrl) throw new Error("AUDIO_BASE_URL must be configured for audio jobs");
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/${encodeURIComponent(audioKey)}`);
  if (!response.ok) throw new Error(`Audio download failed with HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

export function similarity(expected: string, actual: string): number {
  const left = expected.trim().toLowerCase();
  const right = actual.trim().toLowerCase();
  if (left === right) return 1;
  if (!left || !right) return 0;
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row++) {
    const current = [row];
    for (let column = 1; column <= right.length; column++) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return Math.max(0, 1 - previous[right.length] / Math.max(left.length, right.length));
}

export async function handleAnalyze(job: AnalyzeJob): Promise<AnalyzeResult> {
  const startedAt = Date.now();
  const audio = await loadAudio(job.audioKey);
  const transcription = await transcribeAudio(audio, Number(process.env.AUDIO_SAMPLE_RATE || 16000));
  const score = Math.round(similarity(job.expectedText, transcription.text || "") * 100);
  logger.info({ jobId: job.attemptId, studentId: job.studentId, score, correlationId: job.correlationId }, "Audio analysis completed");
  return { success: true, score, duration: Date.now() - startedAt };
}

export async function handleRealtime(job: RealtimeFeedbackJob): Promise<RealtimeFeedbackResult> {
  const transcription = await transcribeAudio(job.audioChunk, Number(process.env.AUDIO_SAMPLE_RATE || 16000));
  return { partialTranscript: transcription.text || "", confidence: transcription.words?.[0]?.confidence || 0 };
}

async function postWebhook<T>(environmentName: string, payload: unknown): Promise<T> {
  const url = process.env[environmentName];
  if (!url) throw new Error(`${environmentName} must be configured`);
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(Number(process.env.WORKER_WEBHOOK_TIMEOUT_MS || 10000)),
  });
  if (!response.ok) throw new Error(`${environmentName} failed with HTTP ${response.status}`);
  const body = await response.text();
  return (body ? JSON.parse(body) : {}) as T;
}

export async function handleNotification(job: NotificationJob): Promise<NotificationResult> {
  const result = await postWebhook<{ channels?: string[] }>("NOTIFICATION_WEBHOOK_URL", job);
  return { delivered: true, channels: result.channels || ["webhook"] };
}

export async function handleEmail(job: EmailJob): Promise<EmailResult> {
  const result = await postWebhook<{ messageId?: string }>("EMAIL_WEBHOOK_URL", job);
  return { sent: true, messageId: result.messageId };
}

async function listFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

export async function handleCleanup(job: CleanupJob): Promise<CleanupResult> {
  const root = process.env.CLEANUP_ROOT;
  if (!root) throw new Error("CLEANUP_ROOT must be configured");
  const cutoff = Date.now() - job.olderThanDays * 24 * 60 * 60 * 1000;
  let deleted = 0;
  let errors = 0;
  for (const file of await listFiles(root)) {
    try {
      if ((await stat(file)).mtimeMs < cutoff) {
        await unlink(file);
        deleted++;
      }
    } catch {
      errors++;
    }
  }
  return { deleted, errors };
}

export async function handleScheduled(job: ScheduledTaskJob): Promise<ScheduledTaskResult> {
  const startedAt = Date.now();
  await postWebhook("SCHEDULED_TASK_WEBHOOK_URL", job);
  return { completed: true, duration: Date.now() - startedAt };
}
