# 📨 BuyTuk Educational Platform - Event-Driven Architecture

**Version:** 1.0.0  
**Last Updated:** 2026-07-13  
**Status:** Final / Production Ready  
**Authority:** Platform Architecture Board  
**Classification:** Internal / Engineering

---

## 📋 Document Control

| Attribute | Value |
|-----------|-------|
| **Document Owner** | Platform Architecture Team |
| **Review Cycle** | Quarterly |
| **Next Review** | 2026-10-13 |
| **Related Documents** | ARCHITECTURE.md, DATABASE-STANDARDS.md, functional-requirements.md |

---

## 1. Executive Summary

This document defines the **Event-Driven Architecture** standards for the BuyTuk Educational Platform. It establishes the protocols, patterns, and best practices for asynchronous communication between services using an event bus and **CloudEvents 1.0** as the event specification.

The event-driven approach enables:
- **Loose Coupling** — Services communicate without direct dependencies
- **Scalability** — Horizontal scaling of event producers and consumers
- **Resilience** — Failure isolation and graceful degradation
- **Auditability** — Complete event history for compliance and debugging
- **Eventual Consistency** — Distributed data synchronization across bounded contexts

---

## 2. Core Principles (Non-Negotiable)

| # | Principle | Description |
|---|-----------|-------------|
| P1 | **Event-First Design** | All state changes emit events. Events are the source of truth for inter-service communication. |
| P2 | **Immutability** | Once published, events cannot be modified or deleted. |
| P3 | **Idempotency** | All event consumers MUST handle duplicate events gracefully. |
| P4 | **Schema Evolution** | Events are versioned. Backward compatibility is mandatory. |
| P5 | **Transactional Integrity** | Use Transactional Outbox pattern to guarantee event delivery. |
| P6 | **Observability** | All events include correlation IDs, trace context, and metadata. |
| P7 | **Security** | Events are encrypted in transit. PII is masked before publishing. |

---

## 3. Topic Naming Convention

**Format:** `{domain}-events`

| Domain | Topic |
|--------|-------|
| Identity | `identity-events` |
| Student | `student-events` |
| Teacher | `teacher-events` |
| Assessment | `assessment-events` |
| Intervention | `intervention-events` |
| Evidence | `evidence-events` |
| AI | `ai-events` |
| Communication | `communication-events` |
| Reporting | `reporting-events` |

**DLQ Topics:** `{domain}-events-dlq`

---

## 4. Event Specification: CloudEvents 1.0

All events **MUST** comply with the [CloudEvents 1.0 specification](https://cloudevents.io/).

### 4.1 CloudEvents Envelope

```typescript
// lib/ events / event.types.ts  (future lib)
export interface CloudEvent<T = unknown> {
  // Required
  specversion:      '1.0';
  id:               string;    // UUID v7
  source:           string;    // e.g., "/services/assessment-service"
  type:             string;    // e.g., "com.buytuk.assessment.assessment.created.v1"
  time:             string;    // ISO 8601
  datacontenttype:  'application/json';
  data:             T;

  // Optional
  subject?: string;            // Resource ID (e.g., "asm_123")

  // BuyTuk extensions (mandatory)
  tenantid:       string;      // Multi-tenancy
  correlationid:  string;      // Distributed tracing
  traceparent:    string;      // W3C Trace Context
  causationid?:   string;      // Event that caused this event
}
```

### 4.2 Event Type Naming Convention

**Format:** `com.buytuk.{domain}.{aggregate}.{action}.v{N}`

| Example Event Type |
|--------------------|
| `com.buytuk.identity.user.created.v1` |
| `com.buytuk.assessment.assessment.published.v1` |
| `com.buytuk.assessment.submission.submitted.v1` |
| `com.buytuk.intervention.referral.approved.v1` |
| `com.buytuk.ai.analysis.completed.v1` |

### 4.3 Action Verbs — Past Tense

| ✅ Correct | ❌ Incorrect |
|------------|--------------|
| `created` | `create` |
| `published` | `publish` |
| `submitted` | `submit` |
| `approved` | `approve` |
| `completed` | `complete` |

---

## 5. Schema Versioning

**Strategy:** Version in event type name, not in payload.

```typescript
// Version 1
type: 'com.buytuk.assessment.assessment.created.v1'

// Version 2 (backward compatible — added optional field)
type: 'com.buytuk.assessment.assessment.created.v2'
```

**Evolution Rules:**

| Change Type | Compatibility | Action |
|-------------|---------------|--------|
| Add optional field | ✅ Backward Compatible | No version bump needed |
| Add required field with default | ✅ Compatible | Minor bump |
| Remove field | ❌ Breaking Change | New major version |
| Rename field | ❌ Breaking Change | New major version |
| Change field type | ❌ Breaking Change | New major version |

---

## 6. Transactional Outbox Pattern

### 6.1 Why It's Required

Without Transactional Outbox:
- Database transaction commits, but event publishing fails → **lost events**
- Event is published, but DB transaction rolls back → **phantom events**
- Retry logic publishes the same event multiple times → **duplicates**

### 6.2 Outbox Table

```sql
CREATE TABLE outbox_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type TEXT NOT NULL,
  aggregate_id   UUID NOT NULL,
  event_type     TEXT NOT NULL,
  event_version  INTEGER NOT NULL DEFAULT 1,
  payload        JSONB NOT NULL,
  metadata       JSONB DEFAULT '{}'::jsonb,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','published','failed')),
  retry_count    INTEGER NOT NULL DEFAULT 0,
  error_message  TEXT,
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for polling pending events
CREATE INDEX idx_outbox_events_status_created
  ON outbox_events(status, created_at)
  WHERE status = 'pending';
```

### 6.3 Outbox Service Pattern

```typescript
// Usage in any route handler / command handler
export async function createAssessmentHandler(input: CreateAssessmentInput) {
  return db.transaction(async (tx) => {
    // 1. Save business entity
    const [assessment] = await tx.insert(assessments).values(input).returning();

    // 2. Save event to outbox IN SAME TRANSACTION
    await tx.insert(outboxEvents).values({
      aggregateType: 'assessment',
      aggregateId:   assessment.id,
      eventType:     'com.buytuk.assessment.assessment.created.v1',
      payload:       assessment,
      metadata: {
        tenantId:      input.tenantId,
        correlationId: input.correlationId,
      },
    });

    return assessment;
  });
}
```

### 6.4 Outbox Polling Publisher

A background process polls the outbox and publishes to the event bus every 5 seconds. Events that fail 5+ times are moved to the DLQ.

---

## 7. Event Consumption

### 7.1 Idempotency (Mandatory)

Every consumer **MUST** check if the event was already processed before acting:

```typescript
// Check before processing
if (await processedEventsRepo.exists(event.id)) {
  logger.info('Duplicate event, skipping', { eventId: event.id });
  return;
}

// Process event...

// Mark as processed (idempotent insert)
await processedEventsRepo.markProcessed(event.id, event.type, consumerGroup);
```

### 7.2 Processed Events Table

```sql
CREATE TABLE processed_events (
  event_id       UUID PRIMARY KEY,
  event_type     TEXT NOT NULL,
  consumer_group TEXT NOT NULL,
  processed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 7.3 Consumer Group Strategy

Each service has its own **consumer group** per topic. Never share consumer groups across services.

---

## 8. Dead Letter Queue (DLQ)

Events that fail processing after **5 retries** are sent to a DLQ (`{domain}-events-dlq`) for manual inspection.

**DLQ Message Format:**
```json
{
  "originalEvent": { "id": "...", "type": "...", "data": {} },
  "error": { "message": "...", "retryCount": 5 },
  "failedAt": "2026-07-13T10:30:00Z",
  "consumerGroup": "notification-service"
}
```

Monitor DLQ lag and set up alerts. Failed events must be replayed after the root cause is fixed.

---

## 9. Security

- **In Transit:** TLS 1.3 for all connections
- **PII Masking:** Sensitive fields (email, phone, national ID) must be masked before publishing
- **Event Validation:** All incoming events must be validated against their JSON Schema
- **Authentication:** Service credentials must be per-service (never shared)

---

## 10. Monitoring & Observability

### 10.1 Required Metrics

| Metric | Purpose |
|--------|---------|
| `events_published_total` | Count of events published |
| `events_consumed_total` | Count of events consumed |
| `events_failed_total` | Count of processing failures |
| `event_processing_duration_seconds` | Processing latency histogram |
| `kafka_consumer_lag` | Consumer group lag |

### 10.2 Distributed Tracing

All events include `traceparent` (W3C Trace Context) for end-to-end tracing across services.

### 10.3 Required Grafana Dashboards

1. **Event Bus Overview** — Published/consumed/failed rates, consumer lag, DLQ rate
2. **Event Processing Health** — Success/failure by event type, retry distribution
3. **Infrastructure Health** — Broker status, replication lag, partition distribution

---

## 11. Event Catalog

### 11.1 Identity Events

| Event Type | Description |
|------------|-------------|
| `com.buytuk.identity.user.created.v1` | New user registered |
| `com.buytuk.identity.user.activated.v1` | User account activated |
| `com.buytuk.identity.user.suspended.v1` | User account suspended |
| `com.buytuk.identity.tenant.created.v1` | New tenant created |
| `com.buytuk.identity.tenant.activated.v1` | Tenant activated |

### 11.2 Assessment Events

| Event Type | Description |
|------------|-------------|
| `com.buytuk.assessment.assessment.created.v1` | Assessment created |
| `com.buytuk.assessment.assessment.published.v1` | Assessment published |
| `com.buytuk.assessment.submission.started.v1` | Student started assessment |
| `com.buytuk.assessment.submission.submitted.v1` | Student submitted assessment |
| `com.buytuk.assessment.grade.calculated.v1` | Grade calculated by AI |
| `com.buytuk.assessment.grade.published.v1` | Grade approved and published by teacher |

### 11.3 Intervention Events

| Event Type | Description |
|------------|-------------|
| `com.buytuk.intervention.referral.submitted.v1` | Referral submitted |
| `com.buytuk.intervention.referral.approved.v1` | Referral approved |
| `com.buytuk.intervention.intervention.created.v1` | Treatment plan created |
| `com.buytuk.intervention.intervention.completed.v1` | Treatment plan completed |

### 11.4 AI Events

| Event Type | Description |
|------------|-------------|
| `com.buytuk.ai.analysis.requested.v1` | AI analysis requested |
| `com.buytuk.ai.analysis.completed.v1` | AI analysis completed (recommendation only) |
| `com.buytuk.ai.analysis.failed.v1` | AI analysis failed |

> **Note:** AI analysis events always result in **recommendations only**. They must be approved by a teacher or specialist before becoming official records. See `ARCHITECTURE.md` Section 12.

---

## 12. Best Practices & Anti-Patterns

### Do's ✅
- Use idempotent consumers — always check `processed_events` before acting
- Include correlation IDs in all events
- Validate event schemas before processing
- Monitor consumer lag — alert on growing lag
- Use DLQ — never lose failed events
- Version events — plan for schema evolution

### Don'ts ❌
- Don't use events for synchronous queries (use REST/API instead)
- Don't store large payloads (> 1 MB per event)
- Don't include unmasked PII in events
- Don't skip idempotency checks — duplicates will happen
- Don't ignore DLQ — monitor and replay regularly
- Don't make breaking changes without a version bump
- Don't share consumer groups across services

---

## 13. Implementation Checklist

Before deploying event-driven features, verify:

- [ ] Event type follows naming convention (`com.buytuk.{domain}.{aggregate}.{action}.v{N}`)
- [ ] Transactional Outbox implemented for event publishing
- [ ] Consumer group configured correctly (unique per service)
- [ ] Idempotency check in place (`processed_events` table)
- [ ] DLQ configured for failed events
- [ ] Monitoring metrics emitted
- [ ] Distributed tracing enabled (`traceparent` in events)
- [ ] PII masked in event payloads
- [ ] Event validation implemented
- [ ] Integration tests cover event flows
- [ ] Alerts configured for DLQ and consumer lag

---

## 14. Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-02-10 | Initial draft |
| 0.5.0 | 2026-04-15 | Added Transactional Outbox pattern |
| 0.8.0 | 2026-06-05 | Added DLQ and monitoring sections |
| 1.0.0 | 2026-07-13 | Final release, aligned with 12 domains |

---

**Document ID:** EVT-001 | **Owner:** Platform Architecture Team
