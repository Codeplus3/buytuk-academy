// =============================================================================
// BuyTuk Academy - Queue Definitions
// =============================================================================

import { Queue } from "bullmq";
import IORedis from "ioredis";
import { getRedisConfig } from "./bullmq.config.js";

// Redis connection
const connection = new IORedis(getRedisConfig().url, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// ===== Main Analysis Queue =====
export const analyzeQueue = new Queue("analyze", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      count: 1000,
      age: 7 * 24 * 3600, // 7 days
    },
    removeOnFail: {
      count: 5000,
      age: 30 * 24 * 3600, // 30 days
    },
  },
});

// ===== Real-time Feedback Queue =====
export const realtimeQueue = new Queue("realtime-feedback", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: {
      count: 500,
      age: 24 * 3600, // 1 day
    },
    removeOnFail: {
      count: 1000,
      age: 24 * 3600,
    },
  },
});

// ===== Notification Queue =====
export const notificationQueue = new Queue("notifications", {
  connection,
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
});

// ===== Email Queue =====
export const emailQueue = new Queue("emails", {
  connection,
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
});

// ===== Cleanup Queue =====
export const cleanupQueue = new Queue("cleanup", {
  connection,
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
});

// ===== Scheduled Tasks Queue =====
export const scheduledQueue = new Queue("scheduled-tasks", {
  connection,
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
});

// ===== Export all queues =====
export const queues = {
  analyze: analyzeQueue,
  realtime: realtimeQueue,
  notification: notificationQueue,
  email: emailQueue,
  cleanup: cleanupQueue,
  scheduled: scheduledQueue,
} as const;

export type QueueName = keyof typeof queues;

// ===== Helper to get queue by name =====
export function getQueue(name: QueueName): Queue {
  return queues[name];
}

// ===== Close all queues =====
export async function closeAllQueues(): Promise<void> {
  await Promise.all(
    Object.values(queues).map((queue) => queue.close())
  );
  await connection.quit();
}