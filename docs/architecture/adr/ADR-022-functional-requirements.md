# ADR-022: Functional Requirements Baseline

**Status:** Accepted  
**Date:** 2026-07-13  
**Supersedes:** None  
**Related:** `docs/architecture/functional-requirements.md`

---

## Context

The platform must support specific functional requirements that define its core value and competitive advantage. These requirements emerged from educational domain research and stakeholder interviews across Saudi Arabia, UAE, and Egypt. They are non-negotiable and must be implemented in full for the first release.

## Decision

**Implement all functional requirements as first-class features — not add-ons or future work.**

### Reading Assessment
- Text visibility configurable by teacher per activity
- Audio always recorded — even when text is hidden
- AI analysis regardless of text visibility setting

### Dictation
- Three audio source types: teacher recording, uploaded file, AI voice
- Text never shown to student during dictation
- Automatic error classification with therapeutic suggestions

### Assessment Types
- All 7 core types mandatory (Reading, Dictation, Pronunciation, Fluency, Comprehension, Handwriting, Writing Composition)
- Each type with specialized AI analysis pipeline
- Teacher validation required for every AI result

### Learning Difficulties
- 6 detectable difficulties (Stuttering, Lisps, Speech Difficulties, Dyslexia, Dysgraphia, Language Delay)
- Each with specific detection indicators and evidence chain
- Treatment plans generated automatically — specialist approval required
- Progress tracked and measured over time

### Support Team
- Social Guide role with behavioral/social case management
- School Psychologist role with encrypted sensitive data access
- Distinct permission sets for each role
- Full audit trail for sensitive data access

### Educational Equity
- Free tier for orphans and humanitarian cases
- Full feature access for eligible students — no feature degradation
- Administrative approval workflow with audit trail
- Annual renewal tracking

### AI Authority
- All AI outputs labelled as recommendations in UI
- Human approval mandatory before any AI output becomes official
- Approval metadata stored (who, when, any modification)
- No AI output sent to parents without human approval

## Rationale

1. **Comprehensive Platform** — These requirements define the platform's core value proposition
2. **Non-Negotiable** — Core features that cannot be deferred without losing market fit
3. **Competitive Advantage** — Distinguishes BuyTuk from generic LMS/assessment platforms
4. **User Expectations** — Teachers, specialists, and parents in target markets expect these capabilities
5. **Regulatory Alignment** — Aligns with educational regulations in Gulf and Arab countries

## Consequences

### Positive
- Clear, complete feature set from day one
- Competitive differentiation in the Arab edtech market
- Foundation for specialist integrations (speech therapy, psychology)
- Strong parent trust through human oversight of AI

### Negative
- Large initial implementation scope
- Requires multiple AI model integrations
- Complex permission system with sensitive data protection
- Extensive testing coverage needed for compliance

## Implementation Notes

- See `lib/api-spec/openapi.yaml` for API contracts covering these requirements
- See `lib/db/src/schema/` for database schema implementing these entities
- See `artifacts/api-server/src/routes/` for API route implementations
- AI recommendations are stored separately from approved results in the database schema

---

**End of ADR-022**
