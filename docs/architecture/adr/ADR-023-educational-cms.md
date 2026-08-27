# ADR-023: Educational CMS System

**Status:** Accepted  
**Date:** 2026-07-13  
**Supersedes:** None  
**Related:** ADR-022 (Functional Requirements Baseline)

---

## Context

The platform must serve diverse educational institutions across the Arab world:
- Government ministries of education
- Private schools
- International schools
- Tutoring centers
- Universities

Each institution has different curricula, assessment methods, grading scales, and requirements. Hardcoding any curriculum would make the platform unusable for most target institutions and permanently limit the addressable market.

## Decision

**Build a complete Educational Content Management System (CMS) as a core capability — not an add-on.**

### Key Design Principles

1. **Dynamic Curriculum** — All curriculum data lives in the database, never in code
2. **Hierarchical Structure** — Year → Stage → Grade → Subject → Semester → Unit → Lesson
3. **Multi-Tenant** — Each school/ministry can have a completely independent curriculum
4. **Versioned** — Previous curriculum versions are preserved for historical student data
5. **Rich Content** — Lessons support text, video, audio, PDF, interactive exercises
6. **Diverse Assessments** — Multiple question types, multiple assessment types per lesson
7. **Therapeutic & Enrichment** — Automatic remedial/enrichment plans based on performance
8. **Multi-Subject** — Arabic language, Mathematics, Science, Foreign Languages, etc.

### Curriculum Hierarchy

```
Academic Year (العام الدراسي)
└── Stage (المرحلة: ابتدائي، متوسط، ثانوي)
    └── Grade (الصف: 1-12)
        └── Subject (المادة: عربي، رياضيات، علوم...)
            └── Semester (الفصل: أول، ثاني)
                └── Unit (الوحدة)
                    └── Lesson (الدرس)
```

### Lesson Content Types

| Content Type | Use Case |
|-------------|----------|
| Text | Explanations, examples |
| PDF / Word / PowerPoint | Official curriculum materials |
| Video | Teacher recordings, educational clips |
| Audio | Pronunciation examples, dictation sources |
| YouTube | Educational videos |
| Interactive exercises | Reading, dictation, handwriting practice |
| Question bank | Tests, quizzes, assessments |
| Homework | Assignments, projects, research |

### Question Bank Types

- True/False
- Multiple choice (single/multi-select)
- Fill in the blank
- Matching
- Ordering / Sequencing
- Drag and drop
- Essay (open-ended)
- Oral response (audio recorded)
- File upload (for projects/artwork)

### Assessment Levels

| Level | Examples |
|-------|---------|
| Lesson | Lesson quiz, remedial quiz, enrichment quiz |
| Unit | Unit test, final unit test |
| Subject | Mid-semester exam, final exam, oral exam |

### Curriculum Management Operations

- Add/edit/delete: years, stages, grades, subjects, units, lessons
- Reorder units and lessons (drag-and-drop in admin UI)
- Copy entire curriculum to new academic year
- Import/export curriculum (JSON/Excel)
- Assign curriculum versions to specific schools or classes
- Version history with rollback capability

### Therapeutic & Enrichment Plans (CMS-driven)

- Remedial plan: automatically generated from weak assessment areas
- Enrichment plan: automatically generated for high-performing students
- Plans reference specific lessons/units in the CMS
- Progress tracked against CMS-defined objectives
- Parent notifications linked to CMS lesson completions

## Rationale

1. **Market Reach** — Serves any educational institution in any Arab country without custom development
2. **Competitive Advantage** — Most edtech platforms are curriculum-specific; BuyTuk is curriculum-agnostic
3. **Scalability** — Add new curricula without code changes or deployments
4. **Revenue** — Enables B2B sales to schools, districts, and ministries
5. **Educational Impact** — Platform adapts to any pedagogical approach or national standard

## Alternatives Considered

### Hardcoded Curriculum
- **Pros:** Simpler initial implementation
- **Cons:** Permanently limits to one curriculum, excludes entire B2B market, no international expansion

### Third-Party LMS Integration (Moodle, Canvas)
- **Pros:** Faster to market, mature CMS features
- **Cons:** Loss of control over UX, complex integration, recurring licensing costs, Arabic/RTL limitations

### Minimal CMS (just lesson metadata)
- **Pros:** Faster implementation
- **Cons:** No rich content support, no question bank, no assessment integration — defeats purpose

## Consequences

### Positive
- Any educational institution can onboard without custom development
- B2B revenue stream from schools and ministries
- Long-term platform scalability
- Curriculum changes as a self-service admin operation

### Negative
- Significant initial implementation scope
- Complex database schema for curriculum hierarchy
- Multi-tenant data isolation must be enforced at every query
- Content migrations required when schema evolves

## Implementation Notes

- Curriculum schema will extend `lib/db/src/schema/` with dedicated CMS tables
- CMS admin UI will be part of `artifacts/admin-dashboard/`
- CMS API endpoints under `/api/v1/curriculum/` in `artifacts/api-server/`
- All curriculum tables include `tenant_id`, `version`, `created_at`, `updated_at`
- Curriculum operations will be covered by existing audit logging infrastructure

---

**End of ADR-023**
