import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import {
  getRedisConfig,
  getWorkerConfig,
  moveToDLQ,
  type AnalyzeJob,
  type CleanupJob,
  type EmailJob,
  type NotificationJob,
  type QueueName,
  type RealtimeFeedbackJob,
  type ScheduledTaskJob,
} from "@buytuk/queue";
import { logger } from "@buytuk/observability";

const queueNames: QueueName[] = [
  "analyze",
  "realtime",
  "notification",
  "email",
  "cleanup",
  "scheduled",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function validateJobData(queueName: QueueName, data: unknown): void {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid data for ${queueName} job`);
  }

  switch (queueName) {
    case "analyze": {
      const job = data as AnalyzeJob;
      if (!isPositiveNumber(job.studentId) || !isPositiveNumber(job.passageId) ||
          !isNonEmptyString(job.audioKey) || !isNonEmptyString(job.expectedText) ||
          !isNonEmptyString(job.correlationId)) {
        throw new Error("Analyze job is missing required fields");
      }
      return;
    }
    case "realtime": {
      const job = data as RealtimeFeedbackJob;
      if (!isPositiveNumber(job.studentId) || !isPositiveNumber(job.passageId) ||
          !isNonEmptyString(job.correlationId) || !isPositiveNumber(job.timestamp)) {
        throw new Error("Realtime feedback job is missing required fields");
      }
      return;
    }
    case "notification": {
      const job = data as NotificationJob;
      if (!isPositiveNumber(job.userId) || !isNonEmptyString(job.type) ||
          !isNonEmptyString(job.title) || !isNonEmptyString(job.body)) {
        throw new Error("Notification job is missing required fields");
      }
      return;
    }
    case "email": {
      const job = data as EmailJob;
      if (!isNonEmptyString(job.to) || !isNonEmptyString(job.type) ||
          !isNonEmptyString(job.subject) || !isNonEmptyString(job.template)) {
        throw new Error("Email job is missing required fields");
      }
      return;
    }
    case "cleanup": {
      const job = data as CleanupJob;
      if (!isNonEmptyString(job.type) || !isPositiveNumber(job.olderThanDays)) {
        throw new Error("Cleanup job is missing required fields");
      }
      return;
    }
    case "scheduled": {
      const job = data as ScheduledTaskJob;
      if (!isNonEmptyString(job.type) || !job.scheduledAt) {
        throw new Error("Scheduled task job is missing required fields");
      }
    }
  }
}

async function processJob(queueName: QueueName, job: Job): Promise<{ processed: true; queue: QueueName }> {
  validateJobData(queueName, job.data);
  logger.info({ queue: queueName, jobId: job.id, correlationId: job.data.correlationId }, "Queue job processed");
  return { processed: true, queue: queueName };
}

export interface WorkerRuntime {
  workers: Worker[];
  connection: IORedis;
}

export function createWorkers(): WorkerRuntime {
  const redisConfig = getRedisConfig();
  const connection = new IORedis(redisConfig.url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  const workers = queueNames.map((queueName) => {
    const config = getWorkerConfig(queueName);
    const worker = new Worker(
      config.name,
      (job) => processJob(queueName, job),
      {
        connection,
        concurrency: config.concurrency,
        limiter: config.limiter,
      },
    );

    worker.on("completed", (job) => {
      logger.info({ queue: queueName, jobId: job.id }, "Queue job completed");
    });
    worker.on("failed", async (job, error) => {
      if (!job) {
        logger.error({ queue: queueName, err: error }, "Queue job failed without a job payload");
        return;
      }

      const maxAttempts = job.opts.attempts ?? 1;
      logger.error({ queue: queueName, jobId: job.id, err: error }, "Queue job failed");
      if (job.attemptsMade >= maxAttempts) {
        try {
          const dlqJobId = await moveToDLQ(queueName, job, error);
          logger.warn({ queue: queueName, jobId: job.id, dlqJobId }, "Queue job moved to DLQ");
        } catch (dlqError) {
          logger.error({ queue: queueName, jobId: job.id, err: dlqError }, "Failed to move queue job to DLQ");
        }
      }
    });
    worker.on("error", (error) => {
      logger.error({ queue: queueName, err: error }, "Queue worker error");
    });

    return worker;
  });

  return { workers, connection };
}

export async function closeWorkers(runtime: WorkerRuntime): Promise<void> {
  await Promise.all(runtime.workers.map((worker) => worker.close()));
  await runtime.connection.quit();
}