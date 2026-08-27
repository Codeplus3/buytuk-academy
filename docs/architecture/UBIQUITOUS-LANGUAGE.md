# 🗣️ BuyTuk Educational Platform - Ubiquitous Language Dictionary

**Version:** 1.0.0  
**Last Updated:** 2026-07-13  
**Status:** Final / Production Ready  
**Authority:** Domain Architecture Board  
**Document ID:** UL-001

---

## 📋 Document Control

| Attribute | Value |
|-----------|-------|
| **Document Owner** | Platform Architecture Team & Domain Experts |
| **Review Cycle** | Quarterly |
| **Next Review** | 2026-10-13 |
| **Related Documents** | ARCHITECTURE.md, BOUNDED-CONTEXT.md, DATABASE-STANDARDS.md |

---

## 1. Executive Summary

The **Ubiquitous Language** is the cornerstone of Domain-Driven Design (DDD) within the BuyTuk Educational Platform. It is a rigorously defined, shared vocabulary used identically by business stakeholders and software developers to describe the system.

This document is the **single source of truth** for all terminology. All code (classes, methods, variables, database columns, API endpoints, and event names) **MUST** strictly reflect the terms defined herein. Ambiguity, synonyms, and colloquialisms are strictly prohibited to prevent model corruption and miscommunication.

---

## 2. What is Ubiquitous Language?

The Ubiquitous Language is:

- **Shared** — Used identically by product managers, educators, administrators, and engineers
- **Contextual** — Terms may have different meanings in different Bounded Contexts (see `BOUNDED-CONTEXT.md`)
- **Living** — Evolves as the business evolves, but changes are governed and documented
- **Executable** — Directly mapped to code artifacts with no translation layer between business talk and code

---

## 3. Global Platform Vocabulary (Shared Kernel)

These terms have the **exact same meaning** across all Bounded Contexts.

| Term | Definition | Code Representation |
|------|------------|---------------------|
| **Tenant** | An isolated educational organization using the platform (Ministry, School, University, Tutoring Center) | `Tenant`, `tenantId` |
| **User** | A person with an authenticated identity in the system | `User`, `userId` |
| **Academic Year** | A defined 12-month educational cycle (e.g., "2026-2027") | `AcademicYear` |
| **Term** | A subdivision of an academic year (e.g., "Fall Semester", "Spring Semester") | `Term` |
| **Timestamp** | A precise point in time, always stored and transmitted in UTC (ISO 8601) | `Timestamp`, `createdAt` |
| **UUID** | A universally unique identifier used for all primary keys | `UUID`, `id` |
| **Soft Delete** | The logical removal of a record by setting `deletedAt` — never a physical `DELETE` | `deletedAt` |
| **Recommendation** | Any AI-generated output — always requires human approval before becoming official | `recommendation`, `requiresHumanValidation` |

---

## 4. Domain-Specific Dictionaries

### 4.1 Identity Context

| Term | Definition | Anti-Pattern (Do Not Use) |
|------|------------|---------------------------|
| **Credential** | Authentication material (password hash, MFA secret, OAuth token) | "Password", "Login Info" |
| **Session** | An authenticated, time-bound interaction context for a User | "Login Session", "Active State" |
| **Verification** | The process of confirming ownership of an email or phone number | "Activation", "Confirmation" |

---

### 4.2 IAM Context

| Term | Definition | Anti-Pattern (Do Not Use) |
|------|------------|---------------------------|
| **Role** | A named collection of Permissions assigned to a User | "Group", "Level", "Tier" |
| **Permission** | A granular right to perform a specific action on a resource (`resource.action`) | "Access", "Right", "Privilege" |
| **Policy** | A set of rules evaluating Subject, Resource, Action, and Environment to permit or deny access | "Rule", "Setting" |

---

### 4.3 Student Context

| Term | Definition | Anti-Pattern (Do Not Use) |
|------|------------|---------------------------|
| **Student** | A User entity specifically enrolled as a learner | "Kid", "Pupil", "Learner" |
| **Enrollment** | The formal association of a Student to a Class and Academic Term | "Registration", "Sign-up" |
| **Guardian** | A User entity with legal or designated oversight responsibility for a Student | "Parent", "Mom/Dad" — use Guardian for inclusivity and legal accuracy |

---

### 4.4 Teacher Context

| Term | Definition | Anti-Pattern (Do Not Use) |
|------|------------|---------------------------|
| **Teacher** | A User entity employed or contracted to facilitate learning | "Instructor", "Educator", "Staff" |
| **Credential** | A professional certification or license with an expiration date *(note: different meaning from Identity Context)* | "Certificate", "Degree" |
| **Assignment** | The mapping of a Teacher to a specific Class and Subject | "Schedule", "Roster" |

---

### 4.5 Assessment Context

| Term | Definition | Anti-Pattern (Do Not Use) |
|------|------------|---------------------------|
| **Assessment** | A structured evaluation of a Student's learning against defined objectives | "Test", "Exam", "Quiz", "Homework" |
| **Submission** | A specific Student's attempt at completing an Assessment | "Answer", "Response", "Attempt" |
| **Rubric** | A predefined set of criteria and performance levels used for scoring | "Grading Sheet", "Marking Scheme" |
| **Mastery** | Demonstrated, evidence-based competence in a specific Learning Objective | "Passed", "Completed", "100%" |
| **Grade** | The calculated, teacher-approved outcome (score, letter, or feedback) of a graded Submission | "Mark", "Score" *(Grade is the formal, approved outcome)* |

---

### 4.6 Intervention Context

| Term | Definition | Anti-Pattern (Do Not Use) |
|------|------------|---------------------------|
| **Referral** | A formal request for a Student to receive additional support | "Ticket", "Request", "Flag" |
| **Intervention** | An active, structured support program for a Student | "Help", "Support", "Program" |
| **Intervention Plan (IIP)** | A documented strategy with specific goals, actions, and timelines for a Student | "IEP" (unless legally designated), "Plan" |
| **Indicator** | An initial, AI- or data-driven signal suggesting a **potential** learning difficulty — never a diagnosis | "Diagnosis", "Disorder", "Disability" |
| **ProgressNote** | Documented observation and measurement of a student's response to an Intervention | "Note", "Update", "Comment" |

---

### 4.7 Evidence Context

| Term | Definition | Anti-Pattern (Do Not Use) |
|------|------------|---------------------------|
| **Evidence** | A digital artifact (audio, video, text, document) submitted as proof of learning or performance | "File", "Attachment", "Upload" |
| **Metadata** | Extracted, structured data about an Evidence artifact (e.g., duration, format, size, language) | "File Info", "Properties" |
| **VirusScanResult** | The security validation outcome of an uploaded Evidence artifact | "Scan", "Check", "Validation" |

---

### 4.8 AI Context

| Term | Definition | Anti-Pattern (Do Not Use) |
|------|------------|---------------------------|
| **Analysis** | The automated processing of Evidence to generate structured insights and recommendations | "Grading", "Checking", "Scoring" |
| **Recommendation** | A suggested action or score generated by AI, which **always requires human validation** before becoming official | "Decision", "Final Grade", "Result", "Diagnosis" |
| **Confidence** | A numerical value (0.0 – 1.0) representing the AI model's certainty in its Recommendation | "Accuracy", "Probability", "Score" |

---

### 4.9 Curriculum Context

| Term | Definition | Anti-Pattern (Do Not Use) |
|------|------------|---------------------------|
| **Lesson** | The atomic unit of curriculum content, containing activities, materials, and assessments | "Chapter", "Topic", "Section" |
| **Unit** | A collection of related Lessons forming a cohesive learning block | "Module", "Chapter" |
| **LearningObjective** | A specific, measurable outcome a student should achieve after a Lesson | "Goal", "Target", "Outcome" |
| **Standard** | A formal educational requirement from a governing authority (e.g., Ministry curriculum) | "Rule", "Requirement" |

---

## 5. Forbidden Terms & Translation Guide

Terms in this table are **strictly forbidden** in code, APIs, database schemas, and documentation. Using them will cause PR rejection in code review.

| ❌ Forbidden Term | ✅ Mandated Term | Context |
|-------------------|--------------------|---------|
| `User` (when referring to a learner) | `Student` | Student Context |
| `Test` / `Exam` / `Quiz` | `Assessment` | Assessment Context |
| `Answer` / `Attempt` | `Submission` | Assessment Context |
| `Grade` (as a verb "to grade") | `Calculate Grade` / `Publish Grade` | Assessment Context |
| `Diagnose` / `Diagnosis` | `Indicator` / `Identify` | AI + Intervention Context |
| `Parent` | `Guardian` | Student Context |
| `Delete` (as a database action) | `Soft Delete` / `Deactivate` | All Contexts |
| `Password` (when stored in DB) | `PasswordHash` / `Credential` | Identity Context |
| `Admin` (used vaguely) | `TenantAdmin` / `SchoolAdmin` / `SuperAdmin` | Identity + IAM Context |
| `File` / `Attachment` | `Evidence` | Evidence Context |
| `Note` / `Update` (in interventions) | `ProgressNote` | Intervention Context |
| `AI Result` / `AI Decision` | `Recommendation` | AI Context |
| `Chapter` / `Module` | `Unit` / `Lesson` | Curriculum Context |

---

## 6. Language in Code

### 6.1 Database Columns

Database columns **MUST** use the Ubiquitous Language terms:

```sql
-- ✅ Correct
student_id     UUID NOT NULL   -- not user_id (in student-scoped tables)
guardian_id    UUID NOT NULL   -- not parent_id
submission_id  UUID NOT NULL   -- not attempt_id or answer_id
deleted_at     TIMESTAMPTZ     -- not is_deleted or removed_at

-- ❌ Wrong
parent_id      UUID NOT NULL   -- use guardian_id
exam_id        UUID NOT NULL   -- use assessment_id
attempt_id     UUID NOT NULL   -- use submission_id
```

### 6.2 API Endpoints

```
-- ✅ Correct
GET  /api/v1/assessments
POST /api/v1/assessments/:id/submissions
GET  /api/v1/interventions/:id/progress-notes

-- ❌ Wrong
GET  /api/v1/tests
POST /api/v1/exams/:id/attempts
GET  /api/v1/supports/:id/notes
```

### 6.3 TypeScript Types

```typescript
// ✅ Correct
interface Assessment { ... }
interface Submission { ... }
type Guardian = { userId: string; studentId: string; ... }

// ❌ Wrong
interface Test { ... }
interface Attempt { ... }
type Parent = { ... }
```

### 6.4 Event Names (CloudEvents)

```
-- ✅ Correct
com.buytuk.assessment.submission.submitted.v1
com.buytuk.intervention.referral.approved.v1
com.buytuk.ai.analysis.completed.v1           -- (recommendation, not decision)

-- ❌ Wrong
com.buytuk.assessment.attempt.completed.v1
com.buytuk.support.ticket.approved.v1
com.buytuk.ai.grade.published.v1
```

---

## 7. Governance & Maintenance

### 7.1 Adding a New Term

1. **Identify Need** — A new business concept emerges lacking a precise term
2. **Propose** — Submit to the Domain Architecture Board with term, definition, and context
3. **Review** — Domain Experts and Lead Engineers review for ambiguity or conflict
4. **Approve & Publish** — Add to this document
5. **Enforce** — Add to Shared Kernel types and enforce via code review

### 7.2 Retiring a Term

1. **Deprecate** — Mark as "Deprecated" with a sunset date (minimum 6 months)
2. **Migrate** — Refactor all code, APIs, and documentation to use the new term
3. **Remove** — After sunset date, remove the term entirely

### 7.3 Enforcement Mechanisms

- **Code Reviews** — PRs using forbidden terms will be rejected
- **API Contracts** — OpenAPI schemas using forbidden terms fail CI/CD
- **Database Schema** — Column and table names must reflect Ubiquitous Language (see `DATABASE-STANDARDS.md` Section 3)
- **Event Names** — CloudEvent types using forbidden terms fail schema registry validation (see `EVENT-ARCHITECTURE.md` Section 4.2)

---

## 8. Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-02-05 | Initial dictionary draft |
| 0.5.0 | 2026-04-20 | Added AI and Intervention context terms |
| 1.0.0 | 2026-07-13 | Final release, aligned with all 12 domains |

---

**Document ID:** UL-001 | **Owner:** Platform Architecture Team & Domain Experts
