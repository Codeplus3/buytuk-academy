// =============================================================================
// BuyTuk Academy - Dead Letter Queue Service
// =============================================================================

import { Queue, Job } from "bullmq";
import IORedis from "ioredis";
import { getRedisConfig } from "./bullmq.config.js";

// DLQ Connection
const dlqConnection = new IORedis(getRedisConfig().url, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// ===== Dead Letter Queue =====
export const deadLetterQueue = new Queue("analyze:dlq", {
  connection: dlqConnection,
  defaultJobOptions: {
    removeOnComplete: {
      count: 10000,
      age: 30 * 24 * 3600, // 30 days
    },
    removeOnFail: {
      count: 10000,
      age: 30 * 24 * 3600,
    },
  },
});

// ===== DLQ Job Interface =====
export interface DLQJob {
  originalJobId: string;
  originalQueue: string;
  originalData: any;
  error: string;
  attemptsMade: number;
  failedAt: string;
  correlationId?: string;
}

// ===== Move Failed Job to DLQ =====
export async function moveToDLQ(
  originalQueue: string,
  job: Job,
  error: Error
): Promise<string> {
  const dlqJob: DLQJob = {
    originalJobId: job.id || "unknown",
    originalQueue,
    originalData: job.data,
    error: error.message,
    attemptsMade: job.attemptsMade,
    failedAt: new Date().toISOString(),
    correlationId: job.data?.correlationId,
  };

  const dlqJobId = `dlq-${originalQueue}-${Date.now()}`;

  await deadLetterQueue.add("failed", dlqJob, {
    jobId: dlqJobId,
  });

  return dlqJobId;
}

// ===== Get DLQ Stats =====
export async function getDLQStats(): Promise<{
  waiting: number;
  active: number;
  completed: number;
}> {
  const [waiting, active, completed] = await Promise.all([
    deadLetterQueue.getWaitingCount(),
    deadLetterQueue.getActiveCount(),
    deadLetterQueue.getCompletedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
  };
}

// ===== Get DLQ Jobs =====
export async function getDLQJobs(
  start: number = 0,
  end: number = 100
): Promise<Array<Job<DLQJob>>> {
  return deadLetterQueue.getJobs(["waiting", "active"], start, end);
}

// ===== Retry DLQ Job =====
export async function retryDLQJob(jobId: string): Promise<void> {
  const job = await deadLetterQueue.getJob(jobId);

  if (!job) {
    throw new Error(`DLQ job not found: ${jobId}`);
  }

  const dlqData = job.data as DLQJob;

  // Re-enqueue to original queue
  const { getQueue } = await import("./queues.js");
  const originalQueue = getQueue(dlqData.originalQueue as any);

  await originalQueue.add(dlqData.originalQueue, dlqData.originalData, {
    jobId: `retry-${dlqData.originalJobId}-${Date.now()}`,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });

  // Remove from DLQ
  await job.remove();
}

// ===== Retry All DLQ Jobs =====
export async function retryAllDLQJobs(): Promise<{
  retried: number;
  failed: number;
}> {
  const jobs = await deadLetterQueue.getJobs(["waiting"]);
  let retried = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      await retryDLQJob(job.id!);
      retried++;
    } catch (error) {
      failed++;
      console.error(`Failed to retry DLQ job ${job.id}:`, error);
    }
  }

  return { retried, failed };
}

// ===== Purge DLQ =====
export async function purgeDLQ(): Promise<number> {
  const jobs = await deadLetterQueue.getJobs(["waiting", "active", "completed", "failed"]);
  let purged = 0;

  for (const job of jobs) {
    await job.remove();
    purged++;
  }

  return purged;
}

// ===== Close DLQ Connection =====
export async function closeDLQ(): Promise<void> {
  await deadLetterQueue.close();
  await dlqConnection.quit();
}