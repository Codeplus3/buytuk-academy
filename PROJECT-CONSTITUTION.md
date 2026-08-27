# 📜 BuyTuk Educational Platform - Project Constitution

**Version:** 1.0.0  
**Last Updated:** 2026-07-13  
**Status:** Final / Binding  
**Authority:** Highest Project Governance Document

---

## 🎯 Preamble

This Constitution establishes the fundamental principles, functional requirements, architectural decisions, and operational standards that govern the BuyTuk Educational Platform. All development, deployment, and operational activities **MUST** comply with this Constitution.

**This Constitution is binding and supersedes all other project documents in case of conflict.**

---

## Table of Contents

1. [Core Principles](#1-core-principles)
2. [Functional Mandates](#2-functional-mandates)
3. [Architectural Decisions](#3-architectural-decisions)
4. [Development Standards](#4-development-standards)
5. [Quality Assurance](#5-quality-assurance)
6. [Security & Privacy](#6-security--privacy)
7. [Compliance Requirements](#7-compliance-requirements)
8. [Operational Standards](#8-operational-standards)
9. [Governance & Amendments](#9-governance--amendments)

---

## 1. Core Principles

### 1.1 Platform Vision

BuyTuk is an **enterprise-grade, multi-tenant educational platform** serving ministries, directorates, schools, universities, and tutoring centers with a unified solution for student management, assessment, intervention, and AI-assisted educational decision-making.

### 1.2 Guiding Principles

| # | Principle | Description |
|---|-----------|-------------|
| P1 | **Domain-Driven Design** | Clear bounded contexts with explicit boundaries and ubiquitous language |
| P2 | **Microservices Architecture** | Independent, deployable services per domain with loose coupling |
| P3 | **Event-Driven Communication** | Asynchronous inter-service communication via CloudEvents specification |
| P4 | **CQRS Pattern** | Separate read and write models for optimal performance |
| P5 | **Clean Architecture** | Layered architecture: Domain → Application → Infrastructure → API |
| P6 | **Multi-Tenancy by Design** | Row-Level Security (RLS) at database level for tenant isolation |
| P7 | **API-First Approach** | OpenAPI 3.0 specifications for all services before implementation |
| P8 | **Infrastructure as Code** | Terraform + Kubernetes manifests for all infrastructure |
| P9 | **GitOps Workflow** | Helm charts + GitHub Actions for automated CI/CD |
| P10 | **Observability by Design** | Metrics, Traces, and Logs via OpenTelemetry from Day 1 |

### 1.3 Non-Negotiable Standards

- **TypeScript Strict Mode** — All TypeScript code MUST use strict mode
- **Test Coverage** — Minimum 85% test coverage for all services
- **Documentation** — All APIs MUST have OpenAPI 3.0 specifications
- **Security** — All code MUST pass security scanning before deployment
- **Performance** — All APIs MUST meet latency SLAs (p95 < 500ms)

---

## 2. Functional Mandates

### 2.1 Assessment Types (9 Mandatory Types)

The platform MUST support the following 9 assessment types:

| # | Type | Description |
|---|------|-------------|
| 1 | **Reading** | Evaluate reading fluency and comprehension |
| 2 | **Dictation** | Assess spelling and listening accuracy |
| 3 | **Writing** | Evaluate writing skills, grammar, and structure |
| 4 | **Pronunciation** | Assess spoken language pronunciation |
| 5 | **Listening Comprehension** | Evaluate understanding of spoken content |
| 6 | **Reading Comprehension** | Assess understanding of written text |
| 7 | **Speaking** | Evaluate oral communication skills |
| 8 | **Mathematics** | Assess mathematical problem-solving |
| 9 | **Multiple Choice** | Standard multiple-choice questions |

**Mandate:** All 9 types MUST be fully implemented and tested before production launch.

### 2.2 AI Role: Assistive, Not Authoritative

**Mandate:** AI serves as a decision support tool, NOT a decision maker.

- AI provides analysis and `Recommendation`s only
- Humans (teachers, specialists) make all final decisions
- All AI-generated outputs carry `requiresHumanValidation: true`
- AI confidence scores MUST be displayed to users
- Users MUST be able to override AI recommendations

**Prohibited:**
- ❌ AI cannot automatically assign grades
- ❌ AI cannot diagnose learning difficulties
- ❌ AI cannot create intervention plans without human approval
- ❌ AI cannot modify student records autonomously

### 2.3 Learning Difficulty Indicators

**Mandate:** AI provides initial `Indicator`s ONLY — not diagnoses.

- AI identifies potential learning difficulties as `Indicator`s
- Professional assessment by qualified specialists is REQUIRED for diagnosis
- All AI indicators MUST be clearly labeled: *"Initial Indicator — Professional Assessment Required"*
- Users MUST be informed that AI indicators are not diagnoses

**Prohibited:**
- ❌ AI cannot provide medical or psychological diagnoses
- ❌ AI indicators cannot be used as official diagnoses
- ❌ AI cannot recommend specific treatments without professional validation

### 2.4 Individual Intervention Plans (IIPs)

**Mandate:** Each student requiring support MUST have a personalized `InterventionPlan`.

Required components:
- Student profile and needs assessment
- Specific, measurable goals
- Intervention strategies and activities
- Timeline and milestones
- Progress tracking metrics
- Team member assignments
- Guardian communication plan

### 2.5 Mastery Learning Model

**Mandate:** Students progress upon demonstrated **mastery**, NOT time-based progression.

- Students advance when they demonstrate `Mastery` of `LearningObjective`s
- `Mastery` is measured through `Assessment`s and `Evidence`
- Personalized learning paths are supported

**Prohibited:**
- ❌ Time-based progression as the sole advancement mechanism
- ❌ Forcing students to advance without demonstrating mastery

### 2.6 Progress Tracking

**Mandate:** Real-time progress tracking with historical analysis is REQUIRED.

- Real-time progress dashboards for students, teachers, and guardians
- Historical trend analysis
- Predictive analytics for identifying at-risk students
- Progress reports in multiple formats (PDF, Excel)

### 2.7 Dashboards (Three Mandatory)

#### Teacher Dashboard
Class performance, individual student progress, assessment results, intervention status, risk indicators

#### Guardian Dashboard
Child's academic progress, assessment results, intervention updates, teacher communication

#### Admin Dashboard
Institutional metrics, resource allocation, staff performance, compliance status, system health

---

## 3. Architectural Decisions

### 3.1 Technology Stack (Mandatory)

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 20+ |
| Language | TypeScript | 5.3+ |
| Framework | Express.js | 4.18+ |
| ORM | Drizzle ORM | 0.29+ |
| Database | PostgreSQL | 15+ |
| Cache | Redis | 7+ |
| Validation | Zod | 3.22+ |
| Testing | Vitest | 1.2+ |
| Cloud | AWS | Latest |
| Container | Docker | Latest |
| Orchestration | Kubernetes (EKS) | 1.28+ |
| IaC | Terraform | 1.6+ |
| Monorepo | pnpm workspaces | 9+ |
| CI/CD | GitHub Actions | Latest |

### 3.2 Architectural Patterns (Mandatory)

| Pattern | Status |
|---------|--------|
| Domain-Driven Design — Bounded contexts, aggregates, entities, value objects | Mandatory |
| CQRS — Separate read/write models | Mandatory |
| Event-Driven — Transactional Outbox + idempotent consumers | Mandatory |
| Circuit Breaker — Fault tolerance for external services | Mandatory |
| Idempotency — Safe operation replay for all write operations | Mandatory |

### 3.3 Database Standards (Mandatory)

- **Primary Keys:** UUID with `gen_random_uuid()` for all entities
- **Multi-Tenancy:** Row-Level Security (RLS) on all tenant-scoped tables
- **Soft Deletes:** `deleted_at` timestamp column — never physical DELETE
- **Audit Fields:** `created_at`, `updated_at`, `version` on all entities
- **JSONB:** For extensible metadata storage
- See [DATABASE-STANDARDS.md](docs/architecture/DATABASE-STANDARDS.md)

### 3.4 API Standards (Mandatory)

- RESTful design, URL-based versioning (`/api/v1/`)
- Cursor-based pagination for all collection endpoints
- Standardized error response format with service error codes
- JWT Bearer tokens, RBAC + ABAC authorization
- OpenAPI 3.0 for all endpoints
- See [API-STANDARDS.md](docs/architecture/API-STANDARDS.md)

### 3.5 Event Standards (Mandatory)

- **CloudEvents 1.0** specification for all events
- **Naming:** `com.buytuk.{domain}.{aggregate}.{action}.v{N}`
- **Idempotency:** All consumers MUST check `processed_events` table
- **Transactional Outbox** for guaranteed delivery
- See [EVENT-ARCHITECTURE.md](docs/architecture/EVENT-ARCHITECTURE.md)

---

## 4. Development Standards

### 4.1 Code Quality (Mandatory)

- TypeScript strict mode in all packages
- ESLint + Prettier enforced via CI
- Conventional Commits enforced via commitlint + Husky
- Code review required before merging

### 4.2 Testing Standards (Mandatory)

| Test Type | Coverage Target |
|-----------|-----------------|
| Unit Tests | > 85% |
| Integration Tests | > 70% |
| E2E Tests | Critical flows |
| Performance Tests | SLA validation |
| Security Tests | OWASP Top 10 |

### 4.3 Documentation Standards (Mandatory)

- OpenAPI 3.0 for all services (updated alongside code — CI enforced)
- JSDoc for all public APIs
- README in every package and service
- ADR for all major architectural decisions
- Runbooks for all critical operational procedures

### 4.4 Branching Strategy (Mandatory)

| Branch | Format |
|--------|--------|
| Feature | `feature/{ticket-id}-{description}` |
| Bugfix | `bugfix/{ticket-id}-{description}` |
| Release | `release/{version}` |
| Hotfix | `hotfix/{ticket-id}-{description}` |

### 4.5 CI/CD Pipeline (Mandatory)

All code MUST pass before merging:

1. ✅ Linting (ESLint)
2. ✅ Formatting (Prettier)
3. ✅ Type Checking (TypeScript)
4. ✅ Unit Tests (Vitest)
5. ✅ Integration Tests
6. ✅ Security Scan (SAST)
7. ✅ Build Success
8. ✅ Code Coverage Check

---

## 5. Quality Assurance

### 5.1 Performance Targets (Mandatory)

| Metric | Target |
|--------|--------|
| API Response Time (p50) | < 100ms |
| API Response Time (p95) | < 500ms |
| API Response Time (p99) | < 1,000ms |
| Database Query Time (p95) | < 100ms |
| Cache Hit Rate | > 80% |
| Service Availability | 99.9% |
| Error Rate | < 1% |
| Throughput | > 1,000 RPS |

### 5.2 Reliability Targets (Mandatory)

| Metric | Target |
|--------|--------|
| Recovery Time Objective (RTO) | < 15 minutes |
| Recovery Point Objective (RPO) | < 5 minutes |
| Mean Time to Recovery (MTTR) | < 30 minutes |
| Mean Time Between Failures (MTBF) | > 720 hours |

### 5.3 Scalability Targets (Mandatory)

| Metric | Target |
|--------|--------|
| Concurrent Users | > 10,000 |
| Requests Per Second | > 5,000 |
| Tenant Count | > 1,000 |

---

## 6. Security & Privacy

### 6.1 Authentication Standards (Mandatory)

- JWT: RS256 algorithm, 15-minute expiration
- Refresh Tokens: 7-day expiration
- Password Hashing: bcrypt with 12 rounds
- MFA: TOTP, SMS, Email
- Account Lockout: 5 failed attempts, 30-minute lockout

### 6.2 Authorization Standards (Mandatory)

- RBAC + ABAC enforced at every endpoint
- Strict tenant isolation via RLS
- Principle of Least Privilege
- All authorization decisions logged

### 6.3 Data Protection (Mandatory)

- Encryption at Rest: AES-256
- Encryption in Transit: TLS 1.3
- PII masking in logs and non-production environments
- Automated data retention policies
- GDPR-compliant right-to-erasure

### 6.4 Security Scanning (Mandatory)

| Check | Tool | Frequency |
|-------|------|-----------|
| SAST | Snyk | Every PR |
| Dependency scan | Snyk | Daily |
| Container scan | Trivy | Every build |
| DAST | OWASP ZAP | Before deployment |
| Penetration testing | External | Quarterly |

---

## 7. Compliance Requirements

### 7.1 GDPR (Mandatory)
- Lawful basis for data processing
- Data subject rights (access, rectification, erasure, portability)
- Data breach notification procedures
- Privacy by Design

### 7.2 FERPA (Mandatory)
- Educational records protection
- Parent access rights
- Student privacy safeguards
- Audit trails for record access

### 7.3 SOC 2 (Mandatory)
- Security, Availability, Confidentiality, Privacy controls
- 99.9% availability SLA

### 7.4 WCAG 2.1 AA (Mandatory)
- Perceivable, Operable, Understandable, Robust

---

## 8. Operational Standards

### 8.1 Monitoring & Alerting (Mandatory)

- **Metrics:** Prometheus + Grafana
- **Tracing:** Jaeger (OpenTelemetry)
- **Logs:** Loki + Promtail
- **Alerts:** AlertManager

### 8.2 Incident Response (Mandatory)

| Severity | Response Time |
|----------|---------------|
| P1 Critical | < 15 minutes |
| P2 High | < 1 hour |
| P3 Medium | < 4 hours |
| P4 Low | < 24 hours |

Post-mortem required for P1 and P2 incidents.

### 8.3 Backup & Recovery (Mandatory)

- Daily full backups + hourly WAL archives
- 30-day backup retention
- Monthly restoration tests
- Cross-region replication

### 8.4 Deployment Standards (Mandatory)

- Blue-Green deployments (zero downtime)
- Canary releases for gradual traffic shifting
- Automated rollback on failure
- Liveness and readiness probes on all services

---

## 9. Governance & Amendments

### 9.1 Constitution Authority

This Constitution is the **highest governance document**. In case of conflict with any other document, this Constitution prevails.

### 9.2 Amendment Process

1. Written proposal with justification
2. Review by Platform Architecture Team
3. Approval by Project Steering Committee
4. Update to Constitution document
5. Notification to all stakeholders
6. Implementation plan with timeline

### 9.3 Review Schedule

- **Quarterly:** Formal review
- **Ad-Hoc:** Emergency amendments for critical issues
- **Annual:** Comprehensive review and update

### 9.4 Compliance Monitoring

- CI/CD pipeline enforces standards automatically
- Quarterly compliance audits
- Monthly compliance reports
- Corrective actions tracked for all violations

---

## Related Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Architecture Reference | `docs/architecture/ARCHITECTURE-REFERENCE.md` | Primary technical reference (26 sections) |
| Domain Overview | `docs/architecture/DOMAIN-OVERVIEW.md` | All 12 domain details |
| Bounded Contexts | `docs/architecture/BOUNDED-CONTEXT.md` | Context map and integration patterns |
| Ubiquitous Language | `docs/architecture/UBIQUITOUS-LANGUAGE.md` | Authoritative term dictionary |
| Database Standards | `docs/architecture/DATABASE-STANDARDS.md` | DB conventions and RLS |
| Event Architecture | `docs/architecture/EVENT-ARCHITECTURE.md` | Event patterns and catalog |
| API Standards | `docs/architecture/API-STANDARDS.md` | REST conventions |
| Project Roadmap | `PROJECT-ROADMAP.md` | Phases, milestones, KPIs |

---

**End of Project Constitution**

**Document ID:** CONST-001  
**Effective Date:** 2026-07-13  
**Next Review:** 2026-10-13  
**Status:** Final / Binding

**This Constitution is binding and MUST be followed by all project participants.**
