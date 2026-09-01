// =============================================================================
// BuyTuk Academy - Structured Logging with Pino
// =============================================================================

import pino, { Logger } from "pino";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Base logger configuration
 */
const baseLogger = pino({
  level: LOG_LEVEL,
  base: {
    service: "buytuk-academy",
    version: process.env.APP_VERSION || "1.0.0",
    environment: NODE_ENV,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});

/**
 * Create child logger with bindings
 */
export function createLogger(bindings?: Record<string, any>): Logger {
  return bindings ? baseLogger.child(bindings) : baseLogger;
}

/**
 * Default logger instance
 */
export const logger = createLogger();

/**
 * Log levels for convenience
 */
export const log = {
  trace: (msg: string, data?: any) => logger.trace(data, msg),
  debug: (msg: string, data?: any) => logger.debug(data, msg),
  info: (msg: string, data?: any) => logger.info(data, msg),
  warn: (msg: string, data?: any) => logger.warn(data, msg),
  error: (msg: string, data?: any) => logger.error(data, msg),
  fatal: (msg: string, data?: any) => logger.fatal(data, msg),
};

/**
 * HTTP request logger middleware for Express
 */
export function httpLogger() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();
    const requestId = req.headers["x-request-id"] || "unknown";

    logger.info(
      {
        type: "http_request",
        method: req.method,
        url: req.url,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
        requestId,
      },
      "Incoming request"
    );

    res.on("finish", () => {
      const duration = Date.now() - startTime;

      const logData = {
        type: "http_response",
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        contentLength: res.getHeader("content-length"),
        requestId,
      };

      if (res.statusCode >= 500) {
        logger.error(logData, "Request failed");
      } else if (res.statusCode >= 400) {
        logger.warn(logData, "Request error");
      } else {
        logger.info(logData, "Request completed");
      }
    });

    next();
  };
}