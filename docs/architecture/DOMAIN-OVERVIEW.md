# 🌐 BuyTuk Educational Platform - Domain Overview

**Version:** 1.0.0  
**Last Updated:** 2026-07-13  
**Status:** Final / Production Ready  
**Authority:** Domain Architecture Reference  
**Document ID:** DOM-001

---

## 📋 Document Control

| Attribute | Value |
|-----------|-------|
| **Document Owner** | Platform Architecture Team |
| **Review Cycle** | Quarterly |
| **Next Review** | 2026-10-13 |
| **Related Documents** | ARCHITECTURE.md, BOUNDED-CONTEXT.md, UBIQUITOUS-LANGUAGE.md |

---

## 1. Executive Summary

The BuyTuk Educational Platform is designed using **Domain-Driven Design (DDD)** principles. The system is decomposed into distinct **Bounded Contexts** (Domains), each encapsulating a specific business capability, its own data model, and its business logic. This ensures loose coupling, high cohesion, independent deployability, and clear ownership.

This document provides a comprehensive overview of all 12 domains, their responsibilities, key entities, interactions, and ownership.

---

## 2. Domain Landscape

### 2.1 Core Domains (8)

These domains represent the core business value and competitive advantage of the platform.

| # | Domain | Service | Port |
|---|--------|---------|------|
| 1 | **Identity** | `identity-service` | 3000 |
| 2 | **IAM** | `iam-service` | 3002 |
| 3 | **Student** | `student-service` | 3003 |
| 4 | **Teacher** | `teacher-service` | 3004 |
| 5 | **Assessment** | `assessment-service` | 3001 |
| 6 | **Intervention** | `intervention-service` | 3005 |
| 7 | **Evidence** | `evidence-service` | 3006 |
| 8 | **AI** | `ai-service` | 3007 |

### 2.2 Supporting Domains (4)

These domains provide essential supporting capabilities to the core domains.

| # | Domain | Service | Status |
|---|--------|---------|--------|
| 1 | **Communication** | `communication-service` | Phase 2 |
| 2 | **Reporting** | `reporting-service` | Phase 2 |
| 3 | **Curriculum** | `curriculum-service` | Phase 2 |
| 4 | **School/Organization** | `school-service` | Phase 2 |

---

## 3. Core Domains Deep Dive

### 3.1 Identity Domain

**Service:** `identity-service` (Port 3000)  
**Purpose:** Manages user identities, multi-tenancy, authentication primitives, and core user lifecycle.

**Key Responsibilities:**
- User registration, profile management, and lifecycle (activation, suspension, soft-deletion)
- Multi-tenant management (Ministry, Directorate, School, University, Tutoring Center)
- Credential management (password hashes, MFA enrollment data)
- Session management primitives

**Key Aggregates:**
- `User` — The core identity entity
- `Tenant` — The organizational boundary
- `OrganizationalUnit` — Hierarchical structure within a tenant

**Ubiquitous Language:** `User`, `Tenant`, `Credential`, `Session`, `Verification`  
**Integration Pattern:** Open Host Service (OHS) — all other domains depend on it  
**Data Ownership:** PII owner — email, phone, national ID (encrypted at rest)

**Dependencies:**
- **Provides:** User data, tenant context to all other domains
- **Consumes:** Nothing (Foundation layer)

---

### 3.2 IAM Domain

**Service:** `iam-service` (Port 3002)  
**Purpose:** Manages authorization, access control policies, roles, and permissions.

**Key Responsibilities:**
- Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC)
- Policy definition and evaluation
- Permission assignment to roles and users
- OAuth2/OIDC client management

**Key Aggregates:**
- `Role` — Named collection of permissions
- `Permission` — Granular access right (`resource.action`)
- `SecurityPolicy` — Complex evaluation rules

**Ubiquitous Language:** `Role`, `Permission`, `Policy`  
**Integration Pattern:** Open Host Service (OHS) — synchronous `/evaluate` + events for cache invalidation

**Dependencies:**
- **Provides:** Authorization decisions to all services
- **Consumes:** User and Tenant data from Identity Domain

---

### 3.3 Student Domain

**Service:** `student-service` (Port 3003)  
**Purpose:** Manages the student lifecycle, enrollment, and academic records.

**Key Responsibilities:**
- Student profile and demographic data management (non-PII — references `userId`)
- Enrollment and class assignment
- Guardian/Parent linkage and contact management
- Academic standing and progression tracking

**Key Aggregates:**
- `Student` — The learner entity (linked to `userId`)
- `Enrollment` — Association between student, class, and term
- `GuardianLink` — Relationship to parent/guardian users

**Ubiquitous Language:** `Student`, `Enrollment`, `Guardian`  
**Integration Pattern:** Customer/Supplier with Assessment and Intervention

**Dependencies:**
- **Provides:** Student context to Assessment, Intervention, and Reporting
- **Consumes:** User data from Identity; Class/School data from School Domain

---

### 3.4 Teacher Domain

**Service:** `teacher-service` (Port 3004)  
**Purpose:** Manages educator profiles, credentials, and classroom assignments.

**Key Responsibilities:**
- Teacher profile and professional development records
- Credential and certification management (with expiry tracking)
- Class and subject assignments
- Teaching load and schedule management

**Key Aggregates:**
- `Teacher` — The educator entity (linked to `userId`)
- `TeacherCredential` — Professional certifications with expiry
- `ClassAssignment` — Association between teacher, class, and subject

**Ubiquitous Language:** `Teacher`, `Credential`, `Assignment`  
**Integration Pattern:** Customer/Supplier with Assessment

**Dependencies:**
- **Provides:** Teacher context to Assessment and Reporting
- **Consumes:** User data from Identity; School/Class data from School Domain

---

### 3.5 Assessment Domain *(Central Domain)*

**Service:** `assessment-service` (Port 3001)  
**Purpose:** The core educational evaluation engine managing assessments, submissions, and grading.

**Key Responsibilities:**
- Assessment creation, configuration, and publishing (supports 9 types: reading, dictation, writing, pronunciation, listening, comprehension, speaking, math, multiple-choice)
- Assignment scheduling and distribution to students/classes
- Submission tracking and attempt management
- Rubric-based grading and score calculation
- Teacher approval workflow for AI-generated grade recommendations

**Key Aggregates:**
- `Assessment` — The evaluation definition
- `Submission` — A student's attempt at an assessment
- `Grade` — The teacher-approved score and feedback
- `Rubric` — Scoring criteria and performance levels

**Ubiquitous Language:** `Assessment`, `Submission`, `Rubric`, `Grade`, `Mastery`  
**Integration Pattern:** Customer to Evidence/AI; Event Notification publisher to Reporting and Communication

**Dependencies:**
- **Provides:** Assessment results to Reporting and Intervention
- **Consumes:** Student/Teacher data, Curriculum objectives, AI analysis results

---

### 3.6 Intervention Domain

**Service:** `intervention-service` (Port 3005)  
**Purpose:** Manages student support programs, referrals, and Individual Intervention Plans (IIPs).

**Key Responsibilities:**
- Referral submission and evaluation workflow
- Creation and management of Individual Intervention Plans (IIPs)
- Progress tracking and milestone management
- Multi-disciplinary team coordination

**Key Aggregates:**
- `Referral` — Request for student support
- `Intervention` — The active support program
- `InterventionPlan` — Detailed goals, strategies, and timeline
- `ProgressNote` — Documented observations and measurements

**Ubiquitous Language:** `Referral`, `Intervention`, `InterventionPlan`, `Indicator`, `ProgressNote`  
**Integration Pattern:** Conformist to Student; Customer/Supplier with Assessment

**Dependencies:**
- **Provides:** Intervention status to Reporting and Dashboards
- **Consumes:** Student data, Assessment results, AI indicators

---

### 3.7 Evidence Domain

**Service:** `evidence-service` (Port 3006)  
**Purpose:** Manages the secure storage, validation, and lifecycle of student work artifacts.

**Key Responsibilities:**
- Secure file upload and storage (object storage integration)
- Virus scanning and content validation
- Metadata extraction and association with submissions
- Retention and archival policies

**Key Aggregates:**
- `Evidence` — The stored artifact (audio, video, text, document)
- `VirusScanResult` — Security validation outcome
- `Metadata` — Extracted properties (duration, format, size)

**Ubiquitous Language:** `Evidence`, `Metadata`, `VirusScanResult`  
**Integration Pattern:** Supplier to Assessment and AI

**Dependencies:**
- **Provides:** Evidence URLs and metadata to Assessment and AI
- **Consumes:** Object storage infrastructure (S3-compatible)

---

### 3.8 AI Domain

**Service:** `ai-service` (Port 3007)  
**Purpose:** Provides AI-assisted analysis and recommendations for educational content.

**Key Responsibilities:**
- Analyzing reading, writing, dictation, and pronunciation evidence
- Generating initial learning difficulty `Indicator`s (NOT diagnoses)
- Scoring confidence and providing actionable feedback
- Enforcing "Human-in-the-Loop" validation — all outputs are `Recommendation`s requiring teacher approval

**Key Aggregates:**
- `AnalysisRequest` — The payload sent to AI models (evidence reference + prompt)
- `AnalysisResult` — The model's output, confidence score, and recommendations

**Ubiquitous Language:** `Analysis`, `Recommendation`, `Confidence`, `Indicator`  
**Integration Pattern:** Anti-Corruption Layer (ACL) against external LLM providers

**Critical Invariant:** Every `AnalysisResult` carries `requiresHumanValidation: true`. The AI domain **never** produces a final grade or clinical diagnosis — only `Recommendation`s.

**Dependencies:**
- **Provides:** Analysis results to Assessment and Intervention
- **Consumes:** Evidence data from Evidence Domain

---

## 4. Supporting Domains Overview

### 4.1 Communication Domain

- **Purpose:** Multi-channel messaging (Email, SMS, In-App, Push notifications)
- **Key Entities:** `Message`, `Template`, `Channel`, `Notification`
- **Role:** Decouples event triggering from delivery — e.g., `GradePublished` event → email to Guardian
- **Integration:** Pure event consumer; never queries other services directly

### 4.2 Reporting Domain

- **Purpose:** Aggregates data from all domains for analytics and dashboards
- **Key Entities:** `DashboardView`, `ReportDefinition`, `ExportJob`
- **Role:** Read-optimized data store (CQRS read model) for Teacher, Guardian, and Admin dashboards
- **Integration:** Pure event consumer; maintains denormalized read tables

### 4.3 Curriculum Domain

- **Purpose:** Manages learning objectives, educational standards, and curriculum hierarchy
- **Key Entities:** `Standard`, `LearningObjective`, `Unit`, `Lesson`
- **Role:** Provides the pedagogical framework that Assessments and Interventions align with
- **Hierarchy:** Year → Stage → Grade Level → Subject → Unit → Lesson

### 4.4 School/Organization Domain

- **Purpose:** Manages the physical and logical structure of educational institutions
- **Key Entities:** `School`, `Department`, `Class`, `Section`, `AcademicTerm`
- **Role:** Provides structural context for Student enrollments and Teacher assignments

---

## 5. Domain Interaction Map

```
                    ┌─────────────┐   ┌─────────────┐
                    │  Identity   │   │    IAM      │
                    │  (OHS/PL)   │   │   (OHS)     │
                    └──────┬──────┘   └──────┬──────┘
                           │ userId/tenantId  │ permissions
          ┌────────────────┼─────────────────┤
          ▼                ▼                 ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │   Student   │  │   Teacher   │  │   School    │
   │  (C/S)      │  │   (C/S)     │  │   (OHS)     │
   └──────┬──────┘  └──────┬──────┘  └─────────────┘
          │                │          ┌─────────────┐
          └────────┬───────┘          │  Curriculum │
                   ▼                  │   (OHS)     │
          ┌─────────────────┐         └──────┬──────┘
          │   Assessment    │◄────────────────┘
          │ (Central Domain)│
          └──┬──────────┬───┘
             │          │
      ┌──────┘          └──────┐
      ▼                        ▼
┌──────────┐            ┌──────────┐
│ Evidence │──────────► │    AI    │
│(Supplier)│            │  (ACL)   │
└──────────┘            └─────┬────┘
                              │ Recommendation
                              ▼
                    ┌─────────────────┐
                    │  Intervention   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     ┌──────────────┐             ┌──────────────┐
     │  Reporting   │             │Communication │
     │ (Event/CQRS) │             │(Event-driven)│
     └──────────────┘             └──────────────┘
```

---

## 6. Shared Kernel & Common Concepts

Managed via shared TypeScript types (not a separate service):

| Concept | Definition | Owner Domain |
|---------|------------|--------------|
| `TenantId` | Unique identifier of the educational institution | Identity |
| `UserId` | Unique identifier of any person in the system | Identity |
| `AcademicYear` | Current academic cycle (e.g., "2026-2027") | School |
| `LearningObjective` | Specific, measurable learning goal | Curriculum |
| `EvidenceId` | Reference to a stored student artifact | Evidence |

---

## 7. Domain Evolution & Roadmap

### Phase 1 — Current

Core domains operational: Identity, IAM, Student, Teacher, Assessment, Intervention, Evidence, AI. API Server (`artifacts/api-server`) provides the unified REST layer.

### Phase 2 — Next 6 Months

- **Curriculum Domain:** Full implementation of dynamic learning path mapping and lesson authoring
- **Reporting Domain:** Advanced predictive analytics for student dropout risk
- **Communication Domain:** Real-time notifications; WebSocket integration for live classroom

### Phase 3 — 12+ Months

- **Gamification Domain:** Badges, leaderboards, and motivational mechanics
- **Third-Party Integration Domain:** LTI (Learning Tools Interoperability) support

---

## 8. Domain Ownership

| Domain | Domain Owner Role |
|--------|-------------------|
| Identity | Lead Identity Engineer |
| IAM | Lead Security Engineer |
| Student | Lead Student Data Engineer |
| Teacher | Lead Educator Systems Engineer |
| Assessment | Lead Assessment Engineer |
| Intervention | Lead Special Education Engineer |
| Evidence | Lead Media/Storage Engineer |
| AI | Lead ML/AI Engineer |

---

## 9. Compliance & Domain Boundaries

| Constraint | Rule |
|------------|------|
| **PII Isolation** | PII (email, phone, national ID) is strictly confined to the Identity and Student domains. All other domains reference users by `userId` only. |
| **Educational Records (FERPA)** | Access is strictly mediated by the IAM domain based on role and context. |
| **AI Ethics** | The AI domain is prohibited from storing raw PII alongside analysis results. It operates on evidence references only. All outputs are `Recommendation`s — never final decisions. |
| **No Cross-Domain DB Access** | No service may query another service's database directly. |

---

## 10. Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-02-01 | Initial domain landscape draft |
| 0.5.0 | 2026-04-10 | Added AI and Evidence domain details |
| 1.0.0 | 2026-07-13 | Final release, aligned with 12 domains and Constitution |

---

**Document ID:** DOM-001 | **Owner:** Platform Architecture Team
