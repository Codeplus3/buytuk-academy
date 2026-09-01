// =============================================================================
// BuyTuk Academy - Prometheus Metrics
// =============================================================================

import {
  collectDefaultMetrics,
  register,
  Counter,
  Histogram,
  Gauge,
} from "prom-client";
import express from "express";

// Collect default metrics (CPU, memory, event loop lag, etc.)
collectDefaultMetrics({
  prefix: "buytuk_",
});

// ===== HTTP Metrics =====
export const httpRequestDuration = new Histogram({
  name: "buytuk_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
});

export const httpRequestTotal = new Counter({
  name: "buytuk_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

export const httpActiveRequests = new Gauge({
  name: "buytuk_http_active_requests",
  help: "Number of active HTTP requests",
  labelNames: ["method"],
});

// ===== Pipeline Metrics =====
export const pipelineDuration = new Histogram({
  name: "buytuk_pipeline_duration_seconds",
  help: "Duration of pipeline stages in seconds",
  labelNames: ["stage"],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120],
});

export const pipelineErrors = new Counter({
  name: "buytuk_pipeline_errors_total",
  help: "Total number of pipeline errors",
  labelNames: ["stage", "error_type"],
});

export const pipelineJobsTotal = new Counter({
  name: "buytuk_pipeline_jobs_total",
  help: "Total number of pipeline jobs",
  labelNames: ["status"],
});

// ===== Queue Metrics =====
export const queueJobDuration = new Histogram({
  name: "buytuk_queue_job_duration_seconds",
  help: "Duration of queue jobs in seconds",
  labelNames: ["queue", "status"],
  buckets: [1, 5, 10, 30, 60, 120, 300],
});

export const queueJobsTotal = new Counter({
  name: "buytuk_queue_jobs_total",
  help: "Total number of queue jobs",
  labelNames: ["queue", "status"],
});

export const queueWaitingJobs = new Gauge({
  name: "buytuk_queue_waiting_jobs",
  help: "Number of waiting jobs in queue",
  labelNames: ["queue"],
});

export const queueActiveJobs = new Gauge({
  name: "buytuk_queue_active_jobs",
  help: "Number of active jobs in queue",
  labelNames: ["queue"],
});

// ===== Model Inference Metrics =====
export const modelLatency = new Histogram({
  name: "buytuk_model_latency_seconds",
  help: "Latency of model inference in seconds",
  labelNames: ["model", "version"],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
});

export const modelRequestsTotal = new Counter({
  name: "buytuk_model_requests_total",
  help: "Total number of model requests",
  labelNames: ["model", "version", "status"],
});

export const modelErrors = new Counter({
  name: "buytuk_model_errors_total",
  help: "Total number of model errors",
  labelNames: ["model", "version", "error_type"],
});

// ===== Database Metrics =====
export const dbQueryDuration = new Histogram({
  name: "buytuk_db_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["operation", "table"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
});

export const dbQueriesTotal = new Counter({
  name: "buytuk_db_queries_total",
  help: "Total number of database queries",
  labelNames: ["operation", "table"],
});

export const dbErrors = new Counter({
  name: "buytuk_db_errors_total",
  help: "Total number of database errors",
  labelNames: ["operation", "table", "error_type"],
});

// ===== Business Metrics =====
export const activeSessions = new Gauge({
  name: "buytuk_active_sessions",
  help: "Number of active reading sessions",
});

export const readingScores = new Histogram({
  name: "buytuk_reading_scores",
  help: "Distribution of reading scores",
  labelNames: ["passage_difficulty"],
  buckets: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
});

export const studentsTotal = new Gauge({
  name: "buytuk_students_total",
  help: "Total number of students",
});

export const passagesTotal = new Gauge({
  name: "buytuk_passages_total",
  help: "Total number of passages",
});

// ===== Register all metrics =====
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpActiveRequests);
register.registerMetric(pipelineDuration);
register.registerMetric(pipelineErrors);
register.registerMetric(pipelineJobsTotal);
register.registerMetric(queueJobDuration);
register.registerMetric(queueJobsTotal);
register.registerMetric(queueWaitingJobs);
register.registerMetric(queueActiveJobs);
register.registerMetric(modelLatency);
register.registerMetric(modelRequestsTotal);
register.registerMetric(modelErrors);
register.registerMetric(dbQueryDuration);
register.registerMetric(dbQueriesTotal);
register.registerMetric(dbErrors);
register.registerMetric(activeSessions);
register.registerMetric(readingScores);
register.registerMetric(studentsTotal);
register.registerMetric(passagesTotal);

// ===== Metrics Endpoint =====
export function metricsRouter() {
  const router = express.Router();

  router.get("/metrics", async (req, res) => {
    try {
      res.set("Content-Type", register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end(String(err));
    }
  });

  return router;
}

// ===== Export all metrics =====
export const metrics = {
  httpRequestDuration,
  httpRequestTotal,
  httpActiveRequests,
  pipelineDuration,
  pipelineErrors,
  pipelineJobsTotal,
  queueJobDuration,
  queueJobsTotal,
  queueWaitingJobs,
  queueActiveJobs,
  modelLatency,
  modelRequestsTotal,
  modelErrors,
  dbQueryDuration,
  dbQueriesTotal,
  dbErrors,
  activeSessions,
  readingScores,
  studentsTotal,
  passagesTotal,
};