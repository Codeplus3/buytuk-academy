# BuyTuk Educational Platform — Architecture Constitution (v1.8)

> **This document is the supreme architectural authority (الدستور المعماري).  
> No decision, pattern, or practice may contradict it.**

---

## 1. Platform Mission

BuyTuk is an **Intelligent Educational Operating System** for the Arab world.  
It provides AI-assisted analysis of student literacy, language acquisition, and learning difficulties — with **mandatory human validation** for every AI decision — and adapts to each student's unique learning journey at national scale.

---

## 2. Core Invariants (Non-Negotiable)

| # | Invariant |
|---|-----------|
| 1 | All AI outputs are **recommendations only** — they become official only after teacher or specialist approval |
| 2 | Student audio/evidence data is **never stored unencrypted** |
| 3 | All state mutations are **audited** (who, what, when, why) |
| 4 | Multi-tenancy is **enforced at the query level** — every data-fetching query MUST include a tenant scope |
| 5 | No circular dependencies between packages |
| 6 | Every file < 500 lines; every function < 50 lines |
| 7 | No hardcoded credentials, secrets, or connection strings |
| 8 | TypeScript strict mode is mandatory across the entire codebase |
| 9 | Evidence is **immutable** once uploaded — only append/version operations allowed |
| 10 | Consent is **checked before** every therapeutic, recording, or psychological operation |

---

## 2A. Architecture Principles (The Supreme Reference)

### Principle 1–15: Foundation Principles
*(Defined in ARCHITECTURE-REFERENCE.md § Architecture Principles)*

### Principle 16: Adaptive Learning
The system adapts to each student's learning pace, style, and needs. No student is forced through a rigid linear path.

### Principle 17: Offline-First
The platform works offline and syncs when connectivity is available. Essential for developing regions and unreliable networks.

### Principle 18: Universal Accessibility
The platform is accessible to all students regardless of disabilities, learning differences, or device limitations. WCAG 2.1 AAA is the minimum bar.

### Principle 19: Explainable AI
Every AI recommendation includes evidence, confidence score, supporting observations, and alternative explanations. No black boxes. Every AI decision records: `evidence_version`, `rubric_version`, `assessment_version`, `curriculum_version`, `twin_version`.

### Principle 20: Student-Centric
Every feature serves the student's learning journey. The Student Digital Twin is the central model for personalization.

---

## 3. Architecture Layers

```
┌──────────────────────────────────────────┐
│          Web / Mobile Frontend           │  artifacts/admin-dashboard
├──────────────────────────────────────────┤
│              API Gateway                 │  artifacts/api-server
├──────────────────────────────────────────┤
│          Business Logic / Engines        │  (future: lib/engines)
├──────────────────────────────────────────┤
│          Data Access (Drizzle ORM)       │  lib/db
├──────────────────────────────────────────┤
│              PostgreSQL                  │
└──────────────────────────────────────────┘
```

---

## 4. Monorepo Structure

```
buytuk-academy/
├── artifacts/
│   ├── api-server/          # Express 5 API — @workspace/api-server
│   └── admin-dashboard/     # React + Vite frontend — @workspace/admin-dashboard
├── lib/
│   ├── db/                  # Drizzle schema + migrations — @workspace/db
│   ├── api-spec/            # OpenAPI spec + codegen config — @workspace/api-spec
│   ├── api-client-react/    # Generated React Query hooks — @workspace/api-client-react
│   └── api-zod/             # Generated Zod schemas — @workspace/api-zod
├── scripts/                 # Utility scripts — @workspace/scripts
├── docs/
│   └── architecture/
│       ├── ARCHITECTURE.md          ← this file
│       ├── ARCHITECTURE-GOVERNANCE.md
│       ├── functional-requirements.md
│       ├── adr/                     # Architecture Decision Records
│       └── [standards documents]
│   └── reference-architecture/      # Per-domain deep dives (~30 pages each)
│       └── assessment.md
└── [config files]
```

---

## 5. Package Dependency Rules

```
admin-dashboard  ──► api-client-react  ──► (HTTP only)
api-server       ──► db, api-zod
db               ──► (no internal deps)
api-spec         ──► (no internal deps)
api-client-react ──► api-spec (types only)
api-zod          ──► api-spec (types only)
```

**Forbidden dependencies:**
- `admin-dashboard` → `db` (direct DB access from frontend)
- `admin-dashboard` → `api-server` (import coupling)
- Any circular dependency

---

## 6. Technology Decisions

| Concern | Choice | ADR |
|---------|--------|-----|
| Runtime | Node.js 24, TypeScript 5.9 | — |
| API | Express 5, OpenAPI-first | ADR-001 |
| DB | PostgreSQL + Drizzle ORM | ADR-005, ADR-006 |
| Validation | Zod v4 + drizzle-zod | ADR-007 |
| Frontend | React 19 + Vite 7 | ADR-010 |
| API Client | Orval (codegen from OpenAPI) | ADR-011 |
| Auth | JWT + Role-based (RBAC) | ADR-013 |
| Multi-tenant | Row-level tenant isolation | ADR-015 |
| Storage | Object storage for evidence files | ADR-018 |
| AI | Provider-agnostic, human-validated | ADR-020 |
| Adaptive Learning | Knowledge Graph + Student Digital Twin | ADR-026 |
| Offline | Offline-first + background sync | ADR-027 |
| Accessibility | WCAG 2.1 AAA + specialized modes | ADR-028 |
| Knowledge Graph | Concept relationship modeling | ADR-029 |
| Student Model | Digital Twin (materialized view) | ADR-030 |

---

## 7. Roles & Permissions

| Role | Scope |
|------|-------|
| `super_admin` | Platform-wide |
| `tenant_admin` | Tenant-wide |
| `school_admin` | School-wide |
| `teacher` | Own classes |
| `social_guide` | Social/behavioral cases |
| `psychologist` | Psychological cases + sensitive data |
| `parent` | Own children only |
| `student` | Own data only |

---

## 8. Assessment Types (Mandatory)

The platform MUST support assessment of:

| Type | Arabic |
|------|--------|
| Reading | القراءة |
| Dictation | الإملاء |
| Pronunciation | النطق |
| Fluency | الطلاقة |
| Comprehension | الفهم |
| Handwriting | الخط |
| Writing Composition | التعبير الكتابي |

---

## 9. Learning Difficulty Detection

The platform MUST detect and support treatment for:

| Difficulty | Arabic |
|-----------|--------|
| Stuttering | التأتأة |
| Lisps | اللدغات |
| Speech Difficulties | صعوبات النطق |
| Dyslexia | عسر القراءة |
| Dysgraphia | عسر الكتابة |
| Language Delay | التأخر اللغوي |

---

## 10. Support Team Roles

### Social Guide / Supervisor (مرشد/مشرف اجتماعي)
- Track social and behavioral issues
- Create social intervention cases
- Communicate with parents
- Coordinate with teachers

### School Psychologist (أخصائي/طبيب نفسي مدرسي)
- Follow up on psychological cases
- Add psychological notes
- Create and modify therapeutic plans
- Access **sensitive psychological data** (restricted permission)

---

## 11. Educational Equity

- ✅ Free subscription for orphans
- ✅ Free subscription for eligible humanitarian cases
- ✅ Educational grants system
- ✅ Administrative approval workflow for grants
- ✅ Full feature access for eligible students — no feature gating

---

## 12. AI Decision Authority

> **All AI decisions remain RECOMMENDATIONS only.  
> They do not become official until approved by the teacher or authorized specialist.**

This invariant applies to:
- Assessment results
- Learning difficulty indicators
- Treatment plan suggestions
- Behavioral analysis
- Progress predictions

### AI Explainability (v1.8)

Every AI recommendation MUST include:

```typescript
interface AIRecommendation {
  recommendation: string;
  confidence: number;           // 0–1
  evidence: Evidence[];         // What data supports this
  reasoning: string;            // Why this recommendation
  alternatives: Alternative[];  // Other options considered
  limitations: string[];        // Known limitations
  // Version audit trail (for reproducibility)
  evidence_version: string;
  rubric_version: string;
  assessment_version: string;
  curriculum_version: string;
  twin_version: string;
  humanReview: {
    required: boolean;
    reviewer?: string;
    decision?: 'approve' | 'modify' | 'reject';
    rationale?: string;
  };
}
```

---

## 13. Educational CMS System

The curriculum is **never hardcoded**. It is a dynamic, versioned, multi-tenant system manageable entirely through the admin dashboard.

### Curriculum Hierarchy
```
Academic Year
└── Stage (المرحلة)
    └── Grade (الصف)
        └── Subject (المادة)
            └── Semester (الفصل الدراسي)
                └── Unit (الوحدة)
                    └── Lesson (الدرس)
```

### CMS Invariants
- Curriculum data lives entirely in the database — never in code
- Curriculum is versioned — historical data is always preserved
- Multi-tenant — different schools can have completely different curricula
- Curriculum changes never require a code deployment
- All curriculum operations are audited

---

## 14. Configuration & Secrets

- All secrets in environment variables — never in source code
- `DATABASE_URL` (also aliased as `BUYTUK_DATABASE_URL`) for database connection
- `SESSION_SECRET` for session signing
- `.env.example` documents all required variables
- Production secrets managed via Replit Secrets

---

## 15. Functional Requirements

**Full details:** `docs/architecture/functional-requirements.md`

### 15.1 Reading Assessment Configuration
- Student sees text during reading **based on activity settings**
- Teacher can configure text visibility: show or hide during reading
- Audio is always recorded regardless of text visibility

### 15.2 Dictation Flexibility
- Teacher can record dictation with their own voice
- Teacher can upload pre-recorded audio file
- System can generate dictation using AI voice
- Student writes what they hear (text NOT shown)

### 15.3 Treatment Plan Management
- Create individualized treatment plans
- Track student progress over time
- Measure improvement percentage
- Adjust plans based on progress
- Re-assessment scheduling

### 15.4 Adaptive Playback Framework (Sub-Domain of Assessment)

Teacher-configurable per activity:

```typescript
interface PlaybackPermissions {
  maxReplayCount?: number;        // null = unlimited
  allowedSpeeds: number[];        // [0.5, 0.75, 1.0, 1.25]
  allowPause: boolean;
  allowWordByWord: boolean;
  allowSentenceReplay: boolean;
  allowParagraphReplay: boolean;
  autoPauseMode: 'none' | 'word' | 'sentence' | 'paragraph';
}
```

Accessibility targets: Dyslexia (word-by-word), Hearing Impairment (slower + visual), Early Grades (controlled pace), ADHD (auto-pause).

**Full details:** `docs/architecture/adaptive-playback.md`

---

## 16. API Design Rules

- OpenAPI spec (`lib/api-spec/openapi.yaml`) is the single source of truth
- All routes versioned under `/api/v1/`
- All endpoints require authentication except health check
- All list endpoints support pagination
- Error responses follow RFC 7807 (Problem Details)
- Input validation via Zod schemas generated from OpenAPI spec

---

## 17. Data Integrity Rules

- All tables include `created_at`, `updated_at`, `tenant_id`
- Soft deletes only — never hard-delete student data
- Foreign keys enforced at DB level
- All migrations are additive — never drop columns in production
- Schema changes require ADR if they affect existing data

---

## 18. Domain Boundaries (v1.8 — 27 Domains)

### Core Domains (25)

| # | Domain | Status | Details |
|---|--------|--------|---------|
| 1 | Identity | L4 Production | Users, roles, sessions, consent, GDPR |
| 2 | Curriculum | L3 Implementation | Content, lessons, units, CMS |
| 3 | Standards | L2 API | Curriculum standards mapping |
| 4 | Competency | L2 API | Competency framework |
| 5 | Assessment | L3 Implementation | All assessment types + Adaptive Playback |
| 6 | Evidence | L3 Implementation | Immutable evidence + AI analysis |
| 7 | AI | L2 API | Provider-agnostic + Explainability Layer |
| 8 | Therapeutic | L3 Implementation | Learning difficulties + treatment plans |
| 9 | Behavioral | L2 API | Values tracking, observations |
| 10 | Intervention | L2 API | Social/behavioral cases |
| 11 | Equity | L2 API | Grants, free subscriptions |
| 12 | Consent Management | L3 Implementation | GDPR consent lifecycle |
| 13 | Reporting | L2 API | Analytics, ministry reports |
| 14 | Notification | L2 API | Push, email, SMS |
| 15 | Audit | L3 Implementation | Immutable audit trail |
| 16 | Governance | L1 Model | Policy governance |
| 17 | Accreditation | L1 Model | Ministry accreditation |
| 18 | Policy Engine | L1 Model | Business rules as data |
| 19 | Workflow Engine | L1 Model | Workflows as data |
| 20 | Learning Impact | L1 Model | True learning measurement |
| 21 | **Adaptive Learning** *(NEW)* | L1 Model | Personalized learning paths |
| 22 | **Knowledge Graph** *(NEW)* | L1 Model | Concept relationships |
| 23 | **Student Digital Twin** *(NEW)* | L1 Model | Holistic student model |
| 24 | **Learning Path Engine** *(NEW)* | L1 Model | Dynamic path selection |
| 25 | **Outcome** *(NEW)* | L1 Model | Long-term outcomes tracking |

### Supporting Domains (2)
| 26 | Storage | L4 Production | Object storage for evidence |
| 27 | Analytics | L2 API | Platform-wide analytics |

### New Domain Specifications

#### Student Digital Twin — Materialized View Invariant
```
Digital Twin ≠ Raw Storage.
Raw Data → Aggregation Layer → Materialized View → AI Analysis
Updated on event triggers only. Never written directly.
```

#### Knowledge Graph — Relationship Types
```
PREREQUISITE | SUPPORTS | DEPENDS_ON | MISCONCEPTION |
ALTERNATIVE_STRATEGY | REAL_LIFE_APPLICATION | CROSS_SUBJECT |
THERAPEUTIC_EXERCISE | ENRICHMENT_ACTIVITY | ASSESSED_BY | EVIDENCED_BY
```

#### Learning Path Engine — Teacher Override Invariant
```
AI recommends → Teacher decides.
If conflict → Teacher override logs reason, wins execution, feeds AI feedback loop.
```

**Full details:** `docs/reference-architecture/` (per-domain deep dives)

---

## 19. Cross-Cutting Concerns (v1.8)

### Offline-First Architecture

The platform works offline and syncs when connectivity is available.

**Sync Queue Priority:**
1. `CRITICAL` — Exam Results, Grades
2. `HIGH` — Evidence Uploads, Attendance
3. `MEDIUM` — Homework, Messages
4. `LOW` — Analytics, Logs, Cache Prefetch

**Conflict Resolution:** Timestamp-based → Field-level merge → Manual resolution (user choice). All conflicts are audited.

**Full details:** `docs/architecture/offline-first.md` | ADR-027

---

### Accessibility Framework

WCAG 2.1 AAA compliance + specialized modes:

| Mode | Target |
|------|--------|
| Dyslexia Mode | OpenDyslexic font, wide spacing, cream background |
| Color Blind Mode | Protanopia / Deuteranopia / Tritanopia palettes |
| Low Vision | Font 12–48px, zoom 1–4x, high contrast |
| ADHD Mode | Reduced motion, focus mode, break reminders |
| Keyboard Only | Full keyboard navigation |
| Screen Reader | ARIA labels, semantic HTML |
| Sign Language | Video avatar support |

Standard Tools: Reading Ruler, Focus Strip, Line Highlight, TTS, STT, Colored Overlay.

**Full details:** `docs/architecture/accessibility.md` | ADR-028

---

### Device Independence

Supported: iOS, Android, Windows, macOS, Linux, ChromeOS, Interactive Whiteboards, Smart TVs.

Strategy: Mobile-first, breakpoints at 320/768/1024/1440px, touch-optimized, keyboard-optimized.

**Full details:** `docs/architecture/device-independence.md`

---

## 20. Architectural Maturity Gate

> **No new domains will be added until Phase 2 (Reference Architecture) is complete for all 27 domains.**
> Value comes from depth, not breadth.

### Reference Architecture Framework

Each domain requires a complete Reference Architecture (~30 pages) covering:

| Section | Content |
|---------|---------|
| 1. Purpose & Scope | What's in, what's out |
| 2. Domain Model | Entities, Value Objects, Relationships |
| 3. Data Model | Tables, Indexes, Constraints |
| 4. API Contracts | REST/gRPC endpoints, Request/Response |
| 5. Events | Domain Events, Integration Events, Payloads |
| 6. Business Rules | Invariants, Validation, Edge Cases |
| 7. Cross-Domain Integration | Dependencies, Anti-Corruption Layers |
| 8. Performance & Scaling | Caching, Query Patterns, Load Limits |
| 9. Security & Privacy | RBAC, Encryption, Consent, Audit |
| 10. Testing Strategy | Unit, Integration, E2E, Property-Based |
| 11. Deployment & Ops | Migrations, Monitoring, Alerts, Rollback |
| 12. Versioning & Evolution | API Versioning, Schema Evolution, Deprecation |

**Sample:** `docs/reference-architecture/assessment.md`

---

## ADRs Index

| # | Title | Status |
|---|-------|--------|
| ADR-001 | API Framework: Express 5 | Accepted |
| ADR-005 | ORM: Drizzle | Accepted |
| ADR-006 | Database: PostgreSQL | Accepted |
| ADR-007 | Validation: Zod v4 | Accepted |
| ADR-010 | Frontend: React 19 + Vite | Accepted |
| ADR-011 | API Codegen: Orval | Accepted |
| ADR-013 | Auth: JWT + RBAC | Accepted |
| ADR-015 | Multi-tenancy: Row-level | Accepted |
| ADR-018 | Storage: Object Storage | Accepted |
| ADR-020 | AI: Provider-agnostic | Accepted |
| ADR-022 | Functional Requirements Baseline | Accepted |
| ADR-023 | Educational CMS System | Accepted |
| ADR-026 | Adaptive Learning System | Accepted |
| ADR-027 | Offline-First Architecture | Accepted |
| ADR-028 | Universal Accessibility | Accepted |
| ADR-029 | Knowledge Graph for Learning | Accepted |
| ADR-030 | Student Digital Twin | Accepted |

---

## Engineering Standards Documents

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE-GOVERNANCE.md](ARCHITECTURE-GOVERNANCE.md) | Governance Manual: ARB, Fitness Functions, Domain Maturity, Change Control |
| [DATABASE-STANDARDS.md](DATABASE-STANDARDS.md) | Naming conventions, mandatory columns, RLS, indexing, migrations, security |
| [EVENT-ARCHITECTURE.md](EVENT-ARCHITECTURE.md) | CloudEvents spec, Transactional Outbox, event catalog, DLQ, idempotency |
| [BOUNDED-CONTEXT.md](BOUNDED-CONTEXT.md) | 12 bounded contexts, integration patterns (OHS, ACL, Customer/Supplier, Conformist) |
| [UBIQUITOUS-LANGUAGE.md](UBIQUITOUS-LANGUAGE.md) | Authoritative term dictionary — forbidden terms, domain-specific vocabularies |
| [DOMAIN-OVERVIEW.md](DOMAIN-OVERVIEW.md) | All 27 domains: responsibilities, key aggregates, ownership, compliance |
| [API-STANDARDS.md](API-STANDARDS.md) | REST conventions, response envelope, pagination, auth, rate limiting, versioning |
| [ARCHITECTURE-REFERENCE.md](ARCHITECTURE-REFERENCE.md) | Full 26-section technical reference: stack, ADRs, security, observability, DR |
| [DEPLOYMENT.md](DEPLOYMENT.md) | K8s, Helm, Terraform, CI/CD, progressive delivery, Policy-as-Code, supply chain |

---

## Project Governance Documents (Root Level)

| Document | Purpose |
|----------|---------|
| [PROJECT-CONSTITUTION.md](../../PROJECT-CONSTITUTION.md) | Highest governance document — binding principles, mandates, compliance |
| [PROJECT-ROADMAP.md](../../PROJECT-ROADMAP.md) | 4-phase delivery plan, milestones, KPIs, risks |

---

## Operational Catalogs (docs/)

| Document | Purpose |
|----------|---------|
| [API-CATALOG.md](../API-CATALOG.md) | Enterprise API Registry — 147 REST + GraphQL + gRPC + WebSocket endpoints |
| [EVENT-CATALOG.md](../EVENT-CATALOG.md) | Authoritative Event Registry — 175 events across all domains |

---

*Last updated: 2026-07-18 — Version 1.8*
