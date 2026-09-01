// =============================================================================
// BuyTuk Academy - OpenTelemetry Tracing
// =============================================================================

import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { trace, Span, SpanStatusCode } from "@opentelemetry/api";
import { logger } from "./logger.js";

const OTEL_ENDPOINT =
  process.env.OTEL_ENDPOINT || "http://localhost:4318/v1/traces";
const SERVICE_NAME = "buytuk-academy";
const SERVICE_VERSION = process.env.APP_VERSION || "1.0.0";

/**
 * Initialize OpenTelemetry SDK
 */
export function initTracing() {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
      [SemanticResourceAttributes.SERVICE_VERSION]: SERVICE_VERSION,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
        process.env.NODE_ENV || "development",
    }),
    traceExporter: new OTLPTraceExporter({
      url: OTEL_ENDPOINT,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-express": { enabled: true },
        "@opentelemetry/instrumentation-http": { enabled: true },
        "@opentelemetry/instrumentation-pg": { enabled: true },
        "@opentelemetry/instrumentation-ioredis": { enabled: true },
        "@opentelemetry/instrumentation-grpc": { enabled: true },
      }),
    ],
  });

  sdk.start();

  logger.info({ endpoint: OTEL_ENDPOINT }, "OpenTelemetry tracing initialized");

  process.on("SIGTERM", async () => {
    try {
      await sdk.shutdown();
      logger.info("OpenTelemetry SDK shut down");
    } catch (err) {
      logger.error({ err }, "Error shutting down OpenTelemetry SDK");
    }
  });
}

/**
 * Get tracer instance
 */
export function getTracer() {
  return trace.getTracer(SERVICE_NAME, SERVICE_VERSION);
}

/**
 * Create span for operation
 */
export function createSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  attributes?: Record<string, any>
): Promise<T> {
  const tracer = getTracer();

  return tracer.startActiveSpan(name, async (span) => {
    try {
      if (attributes) {
        span.setAttributes(attributes);
      }

      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (err as Error).message,
      });
      span.recordException(err as Error);
      throw err;
    } finally {
      span.end();
    }
  });
}

/**
 * Add event to current span
 */
export function addSpanEvent(name: string, attributes?: Record<string, any>) {
  const span = trace.getActiveSpan();
  if (span) {
    span.addEvent(name, attributes);
  }
}

/**
 * Set span attribute
 */
export function setSpanAttribute(key: string, value: any) {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute(key, value);
  }
}

/**
 * Middleware to add tracing to HTTP requests
 */
export function tracingMiddleware() {
  return (req: any, res: any, next: any) => {
    const span = trace.getActiveSpan();

    if (span) {
      span.setAttributes({
        "http.method": req.method,
        "http.url": req.url,
        "http.user_agent": req.headers["user-agent"],
        "http.client_ip": req.ip,
      });

      const correlationId = req.headers["x-correlation-id"];
      if (correlationId) {
        span.setAttribute("correlation.id", correlationId);
      }

      res.on("finish", () => {
        span.setAttributes({
          "http.status_code": res.statusCode,
          "http.response_content_length": res.getHeader("content-length"),
        });
      });
    }

    next();
  };
}