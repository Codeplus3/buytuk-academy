// =============================================================================
// BuyTuk Academy - BullMQ Configuration
// =============================================================================

import type { JobsOptions } from "bullmq";

export interface QueueConfig {
  name: string;
  concurrency: number;
  maxJobsPerWorker: number;
  defaultJobOptions: JobsOptions;
}

export interface RedisConfig {
  url: string;
  prefix?: string;
  maxRetriesPerRequest?: number | null;
  enableReadyCheck?: boolean;
}

// ===== Redis Configuration =====
export function getRedisConfig(): RedisConfig {
  return {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    prefix: process.env.REDIS_PREFIX || "buytuk:",
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
}

// ===== Queue Configurations =====
export const queueConfigs: Record<string, QueueConfig> = {
  analyze: {
    name: "analyze",
    concurrency: 3,
    maxJobsPerWorker: 50,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        count: 1000,
        age: 7 * 24 * 3600,
      },
      removeOnFail: {
        count: 5000,
        age: 30 * 24 * 3600,
      },
    },
  },
  realtime: {
    name: "realtime-feedback",
    concurrency: 10,
    maxJobsPerWorker: 100,
    defaultJobOptions: {
      attempts: 2,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: {
        count: 500,
        age: 24 * 3600,
      },
      removeOnFail: {
        count: 1000,
        age: 24 * 3600,
      },
    },
  },
  notification: {
    name: "notifications",
    concurrency: 5,
    maxJobsPerWorker: 200,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "fixed",
        delay: 5000,
      },
      removeOnComplete: {
        count: 1000,
        age: 7 * 24 * 3600,
      },
      removeOnFail: {
        count: 2000,
        age: 14 * 24 * 3600,
      },
    },
  },
  email: {
    name: "emails",
    concurrency: 2,
    maxJobsPerWorker: 50,
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: {
        count: 500,
        age: 30 * 24 * 3600,
      },
      removeOnFail: {
        count: 1000,
        age: 30 * 24 * 3600,
      },
    },
  },
  cleanup: {
    name: "cleanup",
    concurrency: 1,
    maxJobsPerWorker: 10,
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: {
        count: 100,
        age: 7 * 24 * 3600,
      },
      removeOnFail: {
        count: 500,
        age: 30 * 24 * 3600,
      },
    },
  },
  scheduled: {
    name: "scheduled-tasks",
    concurrency: 2,
    maxJobsPerWorker: 20,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 10000,
      },
      removeOnComplete: {
        count: 200,
        age: 30 * 24 * 3600,
      },
      removeOnFail: {
        count: 500,
        age: 30 * 24 * 3600,
      },
    },
  },
};

// ===== Worker Configuration =====
export interface WorkerConfig {
  name: string;
  concurrency: number;
  limiter?: {
    max: number;
    duration: number;
  };
}

export function getWorkerConfig(queueName: string): WorkerConfig {
  const config = queueConfigs[queueName];
  if (!config) {
    throw new Error(`Queue configuration not found for: ${queueName}`);
  }

  return {
    name: config.name,
    concurrency: config.concurrency,
    limiter: {
      max: config.maxJobsPerWorker,
      duration: 60000, // 1 minute
    },
  };
}

// ===== Queue Metrics =====
export interface QueueMetrics {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
}

export async function getQueueMetrics(queueName: string): Promise<QueueMetrics> {
  const { getQueue } = await import("./queues.js");
  const queue = getQueue(queueName as any);

  const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
    queue.getPausedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    paused,
  };
}