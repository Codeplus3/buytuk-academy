// =============================================================================
// BuyTuk Academy - Health Check Endpoints
// =============================================================================

import express from "express";

export const healthRouter = express.Router();

/**
 * Liveness probe - Returns 200 if application is running
 */
healthRouter.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Readiness probe - Returns 200 if application is ready to serve traffic
 */
healthRouter.get("/health/ready", async (req, res) => {
  const checks = {
    database: await checkDatabaseHealth(),
    redis: await checkRedisHealth(),
    inference: await checkInferenceHealth(),
  };

  const allHealthy = Object.values(checks).every((c) => c === true);
  const status = allHealthy ? "ready" : "not_ready";
  const statusCode = allHealthy ? 200 : 503;

  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    checks,
  });
});

/**
 * Detailed health check
 */
healthRouter.get("/health/detailed", async (req, res) => {
  const startTime = Date.now();

  const checks: Record<string, any> = {};

  // Database
  try {
    const dbHealthy = await checkDatabaseHealth();
    checks.database = {
      status: dbHealthy ? "healthy" : "unhealthy",
      latency: Date.now() - startTime,
    };
  } catch (err) {
    checks.database = {
      status: "error",
      error: (err as Error).message,
    };
  }

  // Redis
  try {
    const redisHealthy = await checkRedisHealth();
    checks.redis = {
      status: redisHealthy ? "healthy" : "unhealthy",
    };
  } catch (err) {
    checks.redis = {
      status: "error",
      error: (err as Error).message,
    };
  }

  // Inference Gateway
  try {
    const inferenceHealthy = await checkInferenceHealth();
    checks.inference = {
      status: inferenceHealthy ? "healthy" : "unhealthy",
    };
  } catch (err) {
    checks.inference = {
      status: "error",
      error: (err as Error).message,
    };
  }

  // Memory usage
  const memUsage = process.memoryUsage();
  checks.memory = {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
  };

  // Uptime
  checks.uptime = {
    seconds: Math.round(process.uptime()),
    human: formatUptime(process.uptime()),
  };

  // Node version
  checks.node = {
    version: process.version,
    platform: process.platform,
    arch: process.arch,
  };

  // Application version
  checks.application = {
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  };

  const allHealthy = Object.values(checks).every(
    (c) => c.status === "healthy" || c.status === "ok"
  );

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks,
  });
});

/**
 * Format uptime in human-readable format
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Check database health
 */
async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { getDrizzleService } = await import("@buytuk/database");
    const service = getDrizzleService();
    return await service.healthCheck();
  } catch {
    return false;
  }
}

/**
 * Check Redis health
 */
async function checkRedisHealth(): Promise<boolean> {
  try {
    const { getRedisConfig } = await import("@buytuk/queue");
    const IORedis = await import("ioredis");
    const redis = new IORedis.default(getRedisConfig().url);
    const result = await redis.ping();
    await redis.quit();
    return result === "PONG";
  } catch {
    return false;
  }
}

/**
 * Check Inference Gateway health
 */
async function checkInferenceHealth(): Promise<boolean> {
  try {
    // Simple TCP check
    const net = await import("net");
    const url = new URL(`http://${process.env.INFERENCE_GATEWAY_URL || "localhost:50050"}`);
    
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(3000);
      
      socket.on("connect", () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on("timeout", () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.on("error", () => {
        resolve(false);
      });
      
      socket.connect(parseInt(url.port), url.hostname);
    });
  } catch {
    return false;
  }
}

/**
 * Middleware to add health check headers
 */
export function healthCheckMiddleware() {
  return (req: any, res: any, next: any) => {
    res.setHeader("X-Health-Check", "/health/live");
    res.setHeader("X-Readiness-Check", "/health/ready");
    next();
  };
}