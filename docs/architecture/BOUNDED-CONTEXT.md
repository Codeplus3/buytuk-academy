# 🗺️ BuyTuk Educational Platform - Bounded Context Map

**Version:** 1.0.0  
**Last Updated:** 2026-07-13  
**Status:** Final / Production Ready  
**Authority:** Domain Architecture Board  
**Document ID:** BCM-001

---

## 📋 Document Control

| Attribute | Value |
|-----------|-------|
| **Document Owner** | Platform Architecture Team |
| **Review Cycle** | Quarterly |
| **Next Review** | 2026-10-13 |
| **Related Documents** | ARCHITECTURE.md, UBIQUITOUS-LANGUAGE.md, DATABASE-STANDARDS.md, EVENT-ARCHITECTURE.md |

---

## 1. Executive Summary

This document defines the **Bounded Contexts** of the BuyTuk Educational Platform. It explicitly maps the semantic boundaries of each domain, the Ubiquitous Language within each context, and the integration patterns used for communication between contexts.

This map is the single source of truth for preventing architectural decay, avoiding "distributed monoliths," and ensuring that cross-domain integration is deliberate, typed, and governed.

---

## 2. Context Map Overview

The platform consists of **12 Bounded Contexts** categorised into Core, Supporting, and Generic domains.

```
┌─────────────────── Generic / Foundational ───────────────────┐
│   [Identity Context]           [School/Org Context]           │
└──────────────────────────────────────────────────────────────┘
         │ OHS/PL                        │ OHS
         ▼                               ▼
┌─────────────────────── Core Domains ─────────────────────────┐
│   [Student Context]    [Teacher Context]                      │
│         │                    │                                │
│         └──────────┬─────────┘                               │
│                    ▼                                          │
│           [Assessment Context]  ◄── Curriculum Context        │
│                    │                                          │
│                    ▼                                          │
│           [Intervention Context]                              │
└──────────────────────────────────────────────────────────────┘
         │ Events                        │ Events
         ▼                               ▼
┌─────────────────── Supporting Domains ───────────────────────┐
│  [IAM]  [Evidence]  [AI]  [Communication]  [Reporting]        │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Integration Patterns Legend

| Pattern | Description | Usage in BuyTuk |
|---------|-------------|-----------------|
| **OHS (Open Host Service)** | Upstream provides a published API/Events for multiple downstream consumers | Identity, IAM, School |
| **PL (Published Language)** | A shared, well-documented schema (OpenAPI / CloudEvents) for OHS communication | All OHS providers |
| **Customer/Supplier** | Two teams cooperate — upstream (Supplier) accommodates downstream (Customer) needs | Assessment ↔ Student, Assessment ↔ Teacher |
| **Conformist** | Downstream blindly adopts upstream's model — no leverage to request changes | Intervention conforming to Student data model |
| **ACL (Anti-Corruption Layer)** | Downstream builds a translation layer to protect its model from upstream volatility | AI Service ↔ External LLM Providers |
| **Event Notification** | Upstream emits events; downstream listens and updates its own read models asynchronously | Assessment → Reporting, Assessment → Communication |
| **Shared Kernel** | Strictly controlled, versioned shared code (e.g., `@workspace/shared` types) | Base Entities, Value Objects, Error Codes |

---

## 4. Bounded Context Details

### 4.1 Identity Context

**Type:** Generic / Foundational  
**Upstream:** None  
**Downstream:** All other contexts

**Purpose:** Manages user authentication, multi-tenancy, and core user lifecycle. Single source of truth for "Who is this user?" and "Which tenant do they belong to?"

**Ubiquitous Language:**
- `User` — A person with credentials in the system
- `Tenant` — An organization (Ministry, School, etc.) isolating data
- `Credential` — Authentication material (password hash, MFA secret)

**Integration Pattern:** **Open Host Service (OHS)** with **Published Language (PL)**
- Provides `/api/v1/users` and `UserCreated`/`UserUpdated` events
- **Rule:** Downstream contexts MUST NOT store PII (email, phone). They MUST store only `userId` and `tenantId`

---

### 4.2 IAM Context (Identity & Access Management)

**Type:** Supporting  
**Upstream:** Identity  
**Downstream:** All other contexts

**Purpose:** Centralized authorization, policy evaluation, and role/permission management.

**Ubiquitous Language:**
- `Role` — A named collection of permissions
- `Permission` — A specific action on a resource (`resource.action`)
- `Policy` — A rule evaluating subject, resource, action, and environment

**Integration Pattern:** **Open Host Service (OHS)**
- Provides synchronous REST `/evaluate` endpoint for permission checks
- Emits `RoleAssigned`, `PermissionRevoked` events for local cache invalidation

---

### 4.3 Student Context

**Type:** Core  
**Upstream:** Identity, School  
**Downstream:** Assessment, Intervention, Reporting

**Purpose:** Manages the learner's academic lifecycle, enrollment, and demographic profile (non-PII only — linked by `userId`).

**Ubiquitous Language:**
- `Student` — A learner entity linked to a `User`
- `Enrollment` — The association of a student to a class/term
- `GuardianLink` — The relationship mapping a student to a parent/guardian user

**Integration Pattern:** **Customer/Supplier** with Assessment/Intervention
- Assessment requests student context; Student service guarantees data consistency for active enrollments

---

### 4.4 Teacher Context

**Type:** Core  
**Upstream:** Identity, School  
**Downstream:** Assessment, Reporting

**Purpose:** Manages educator profiles, professional credentials, and classroom assignments.

**Ubiquitous Language:**
- `Teacher` — An educator entity linked to a `User`
- `Credential` — Professional certification (with expiry tracking)
- `ClassAssignment` — The mapping of a teacher to a specific class and subject

**Integration Pattern:** **Customer/Supplier** with Assessment
- Provides teacher availability and assignment context for assessment creation and grading workflows

---

### 4.5 Assessment Context *(Central Domain)*

**Type:** Core  
**Upstream:** Student, Teacher, Curriculum, IAM, Evidence, AI  
**Downstream:** Intervention, Reporting, Communication

**Purpose:** The central engine for creating, distributing, executing, and grading educational evaluations. This is the most connected context in the platform.

**Ubiquitous Language:**
- `Assessment` — The definition of an evaluation
- `Submission` — A specific student's attempt at an assessment
- `Rubric` — Scoring criteria and performance levels
- `Grade` — The calculated, teacher-approved outcome of a submission

**Integration Pattern:**
- **Customer** to Evidence/AI — requests analysis, receives typed `AnalysisResult`
- **Event Notification** publisher to Reporting and Communication — emits `SubmissionSubmitted`, `GradePublished`

---

### 4.6 Intervention Context

**Type:** Core  
**Upstream:** Student, Assessment, AI  
**Downstream:** Reporting, Communication

**Purpose:** Manages targeted student support, referrals, and Individual Intervention Plans (IIPs).

**Ubiquitous Language:**
- `Referral` — A formal request for student support
- `Intervention` — The active support program
- `InterventionPlan` — Detailed goals, strategies, and timelines
- `ProgressNote` — Documented observations and measurements

**Integration Pattern:**
- **Conformist** to Student Context — adopts Student's definition without modification
- **Customer/Supplier** with Assessment — consumes assessment performance data to trigger referrals

---

### 4.7 Evidence Context

**Type:** Supporting  
**Upstream:** None (infrastructure boundary)  
**Downstream:** Assessment, AI

**Purpose:** Manages secure storage, validation, metadata extraction, and lifecycle of student work artifacts (audio, video, text).

**Ubiquitous Language:**
- `Evidence` — The stored artifact (audio, video, text, document)
- `VirusScanResult` — The security validation outcome of an upload
- `Metadata` — Extracted properties (duration, format, size)

**Integration Pattern:** **Supplier** to Assessment and AI
- Provides presigned URLs for uploads
- Provides secure, time-limited access URLs for AI analysis

---

### 4.8 AI Context

**Type:** Supporting  
**Upstream:** Evidence  
**Downstream:** Assessment, Intervention

**Purpose:** Provides AI-assisted analysis, scoring recommendations, and learning difficulty indicators.

**Ubiquitous Language:**
- `AnalysisRequest` — The payload sent to AI models (evidence reference + prompt)
- `AnalysisResult` — The model's output, confidence score, and recommendations
- `Indicator` — An initial, non-diagnostic flag for potential learning difficulties

**Integration Pattern:** **Anti-Corruption Layer (ACL)**
- Protects the internal domain model from volatile, unstructured external LLM responses (OpenAI, Anthropic)
- Translates external API responses into strict, typed `AnalysisResult` value objects
- **Invariant:** All `AnalysisResult` objects have `requiresHumanValidation: true` — enforced by the ACL

---

### 4.9 Curriculum Context

**Type:** Supporting  
**Upstream:** None  
**Downstream:** Assessment, Reporting

**Purpose:** Manages learning objectives, educational standards, and curriculum hierarchy (Year → Stage → Grade → Subject → Unit → Lesson). See `ARCHITECTURE.md` Section 13.

**Ubiquitous Language:**
- `Standard` — A formal educational requirement
- `LearningObjective` — A specific, measurable learning goal
- `Lesson` — The atomic unit of curriculum content

**Integration Pattern:** **Open Host Service (OHS)**
- Provides a read-only catalog of objectives for assessments to align with

---

### 4.10 School/Organization Context

**Type:** Generic  
**Upstream:** Identity  
**Downstream:** Student, Teacher

**Purpose:** Manages the physical and logical structure of educational institutions (Schools, Departments, Classes, Terms).

**Ubiquitous Language:**
- `School` — A physical or logical educational institution
- `Class` — A group of students taught together
- `AcademicTerm` — A defined period of the academic year

**Integration Pattern:** **Open Host Service (OHS)**
- Provides structural context ("Which students are in Class 10A?") to Student and Teacher contexts

---

### 4.11 Communication Context

**Type:** Supporting  
**Upstream:** All (via Events)  
**Downstream:** External Providers (SMTP, SMS, Push)

**Purpose:** Multi-channel messaging and notification delivery.

**Ubiquitous Language:**
- `Template` — A reusable message structure with variables
- `Channel` — The delivery medium (Email, SMS, In-App)
- `Notification` — A specific instance of a message sent to a user

**Integration Pattern:** **Event Notification** consumer
- Listens to domain events (e.g., `GradePublished`) and maps them to notification templates
- Never queries other services directly — purely event-driven

---

### 4.12 Reporting Context

**Type:** Supporting  
**Upstream:** All (via Events)  
**Downstream:** Dashboards (Frontend)

**Purpose:** Aggregates data from all domains into read-optimized models for analytics and dashboards.

**Ubiquitous Language:**
- `DashboardView` — A pre-aggregated read model for a specific UI component
- `ExportJob` — An asynchronous request to generate a CSV/PDF report

**Integration Pattern:** **Event Notification** consumer (CQRS Read Model)
- Listens to all core domain events to maintain denormalized, query-optimized tables

---

## 5. Shared Kernel Management

The `@workspace/shared` types package acts as a strictly controlled **Shared Kernel**.

**Rules:**

1. **Read-Only for Consumers** — Downstream services consume types, never modify them
2. **Allowed Contents:**
   - Base Entity interfaces (`BaseEntity`, `UUID`, `Timestamp`)
   - Value Objects (`DateRange`, `Email`, `Money`)
   - Enum definitions (`UserStatus`, `AssessmentType`)
   - Standard Error Codes (`ERROR_CODES`)
   - Zod validation schemas for common types
3. **Prohibited Contents:**
   - Business logic
   - Service clients
   - Database configurations
4. **Versioning** — Any breaking change requires a major version bump and coordinated deployment

---

## 6. Anti-Corruption Layer (ACL) Specifications

### 6.1 AI Service ACL

The AI Service implements an ACL to isolate the core domain from external LLM APIs.

**External Model (Raw LLM response):**
```json
{
  "id": "chatcmpl-123",
  "choices": [{ "message": { "content": "The student shows signs of dyslexia..." } }],
  "usage": { "total_tokens": 150 }
}
```

**Internal Model (translated via ACL):**
```typescript
interface AnalysisResult {
  recommendation:          string;  // Sanitized, structured output
  confidence:              number;  // 0.0 – 1.0
  requiresHumanValidation: true;    // Enforced by ACL — never false
  tokenUsage:              number;
}
```

*The ACL strips raw LLM metadata, enforces the `requiresHumanValidation` invariant, and maps unstructured text into structured `recommendation` fields. This invariant cannot be bypassed.*

### 6.2 External Identity Provider ACL (Future)

When integrating with external IdPs (Google Workspace, Microsoft Entra ID), an ACL will map external OIDC claims to the internal `Identity` context's `User` model, preventing external schema changes from breaking internal logic.

---

## 7. Forbidden Integrations

| ❌ Forbidden | Reason |
|-------------|--------|
| Direct database access across services | Breaks bounded context isolation |
| Shared database schema across two services | Implicit coupling through schema |
| More than 2 synchronous service-to-service calls in a single request | Use async events for longer chains |
| Importing another service's internal types | Use Published Language / OpenAPI only |

---

## 8. Context Mapping Governance

### 8.1 Changing a Bounded Context Boundary
1. Submit an **Architecture Decision Record (ADR)** proposing the change
2. Review by Platform Architecture Team
3. If approved, update this `BOUNDED-CONTEXT.md`
4. Refactor code to enforce the new boundary

### 8.2 Introducing a New Integration
1. Identify the required pattern (Event Notification, Customer/Supplier, etc.)
2. Define the **Published Language** (OpenAPI schema or CloudEvent schema)
3. Register the schema in the central Schema Registry
4. Implement with contract testing (Pact)

---

## 9. Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-02-01 | Initial Context Map draft |
| 0.5.0 | 2026-04-15 | Added ACL specifications for AI |
| 1.0.0 | 2026-07-13 | Final release, aligned with 12 domains |

---

**Document ID:** BCM-001 | **Owner:** Platform Architecture Team
