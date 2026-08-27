# BuyTuk Educational Platform - Architecture Governance

**Document Type:** Governance Manual  
**Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-07-13  
**Authority Level:** Constitutional (Level 2 - Below ARCHITECTURE.md, Above Implementation)  
**Owner:** Architecture Review Board (ARB)

---

## Constitutional Authority

> **This document defines how the architecture is enforced, reviewed, and evolved over time.**
> 
> **It is the operational companion to ARCHITECTURE.md.**
> 
> **While ARCHITECTURE.md defines WHAT the system is, this document defines HOW we protect it.**

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Governance Structure](#2-governance-structure)
3. [Architecture Review Checklist](#3-architecture-review-checklist)
4. [Domain Acceptance Checklist](#4-domain-acceptance-checklist)
5. [ADR Rules](#5-adr-rules)
6. [Architecture Fitness Functions](#6-architecture-fitness-functions)
7. [Domain Maturity Levels](#7-domain-maturity-levels)
8. [Change Control Process](#8-change-control-process)
9. [Exception Management](#9-exception-management)
10. [Compliance Monitoring](#10-compliance-monitoring)
11. [Governance Cadence](#11-governance-cadence)
12. [Consequences of Violations](#12-consequences-of-violations)

---

## 1. Purpose

### 1.1 Why This Document Exists

Architecture without governance decays. This document ensures:

- **Consistency** - Every developer follows the same rules
- **Longevity** - The system remains maintainable for 15-20 years
- **Quality** - No architectural debt accumulates silently
- **Accountability** - Clear ownership of architectural decisions
- **Evolution** - Controlled, deliberate change over time

### 1.2 Scope

**In Scope:**
- Pull Request review criteria
- Domain lifecycle management
- ADR governance
- Automated fitness functions
- Maturity assessment
- Exception handling

**Out of Scope:**
- Code style (covered by ESLint/Prettier)
- Business requirements (covered by Product)
- Deployment procedures (covered by DevOps)

### 1.3 Target Audience

- All developers
- Tech leads
- Domain owners
- Architecture Review Board
- AI assistants working on the codebase

---

## 2. Governance Structure

### 2.1 Roles & Responsibilities

| Role | Responsibility | Authority |
|------|----------------|-----------|
| **Architecture Owner** | Final authority on constitution | Can approve/reject any architectural change |
| **Architecture Review Board (ARB)** | Reviews ADRs, major changes | 3-5 senior architects |
| **Domain Owners** | Own specific bounded contexts | Can approve domain-level decisions |
| **Tech Leads** | Enforce governance in PRs | Can block non-compliant PRs |
| **All Developers** | Follow the constitution | Must raise concerns about violations |

### 2.2 Decision Authority Matrix

| Decision Type | Authority | Process |
|---------------|-----------|---------|
| New domain | Architecture Owner + ARB | Full ADR + review |
| Domain boundary change | ARB | ADR required |
| New technology | ARB | ADR required |
| New rule | Architecture Owner | Proposal + review |
| Implementation detail | Domain Owner | Code review |
| Exception to rules | ARB | Formal exception request |

---

## 3. Architecture Review Checklist

**Every Pull Request MUST pass this checklist before merge.**

### 3.1 Domain Boundary Checks

```
□ No new domain added without ADR
  → If yes: REJECT. Require ADR-XXX first.

□ No cross-domain direct imports
  → If yes: REJECT. Require event-based communication.

□ No domain calling another domain's internal APIs
  → If yes: REJECT. Use public contracts only.

□ No circular dependencies introduced
  → If yes: REJECT. Run `pnpm check:circular` locally.
```

### 3.2 Core Invariant Checks

```
□ AI never makes final decisions
  → If AI output is auto-published: REJECT.
  → Every AI recommendation must have human validation step.

□ No hardcoded curriculum
  → If curriculum data in code: REJECT.
  → All curriculum must come from database.

□ No hardcoded policies
  → If business rules in code: REJECT.
  → Use Policy Engine domain.

□ Evidence is immutable
  → If evidence update operation exists: REJECT.
  → Only append/version operations allowed.

□ Consent checked for sensitive operations
  → If therapeutic/recording/psychological ops without consent: REJECT.

□ Audit trail exists for sensitive operations
  → If audit missing: REJECT.
```

### 3.3 Layer & Pattern Checks

```
□ Repository Pattern used for all DB access
  → If direct DB calls in Service: REJECT.

□ No business logic in Controllers
  → If controller has logic: REJECT. Move to Service.

□ No direct DB access from AI layer
  → If AI writes to DB: REJECT.

□ Interfaces used for all cross-layer dependencies
  → If concrete classes injected: REJECT.

□ No global state
  → If global variables: REJECT. Use DI.
```

### 3.4 Quality Checks

```
□ All files < 500 lines
  → If exceeded: REJECT. Refactor first.

□ Cyclomatic complexity < 10
  → If exceeded: REJECT. Simplify.

□ Test coverage >= 80% for changed files
  → If below: REJECT. Add tests.

□ No TODO/FIXME/HACK in production code
  → If present: REJECT. Create tech debt ticket.

□ No magic values
  → If hardcoded numbers/strings: REJECT. Use constants/config.
```

### 3.5 Security & Privacy Checks

```
□ No secrets in code
  → If API keys/passwords: REJECT IMMEDIATELY. Security incident.

□ Input validation on all endpoints
  → If missing: REJECT.

□ Authentication required on all non-public endpoints
  → If missing: REJECT.

□ No sensitive data in logs
  → If passwords/tokens/PII logged: REJECT.

□ Consent management integrated where required
  → If missing: REJECT.
```

### 3.6 Documentation Checks

```
□ Contract documented (Rule 21)
  → If missing: REJECT.

□ Public API documented
  → If missing: REJECT.

□ ADR created if architectural decision made
  → If missing: REJECT.
```

---

## 4. Domain Acceptance Checklist

**A Domain is considered "Accepted" only when ALL criteria are met.**

### 4.1 Documentation Requirements

```
□ Purpose statement (why this domain exists)
□ Scope definition (what's in, what's out)
□ Invariants (what must always be true)
□ Bounded context diagram
□ Ubiquitous language glossary
□ Domain events catalog
□ API contracts (OpenAPI/GraphQL schema)
□ Data model (ER diagram)
□ Integration points (depends on / depended on by)
```

### 4.2 Implementation Requirements

```
□ Public API implemented
□ Internal implementation hidden
□ Repository pattern applied
□ Event bus integration
□ Error handling strategy
□ Logging strategy
□ Audit logging
□ Consent management (if applicable)
□ Performance benchmarks met
□ Security controls applied
```

### 4.3 Quality Requirements

```
□ Unit tests: >= 80% coverage
□ Integration tests: all critical paths
□ E2E tests: key user flows
□ Performance tests: within budget
□ Security tests: passed
□ Accessibility tests: WCAG 2.1 AA
□ Load tests: within capacity
```

### 4.4 Operational Requirements

```
□ Monitoring in place
□ Alerting configured
□ Health checks implemented
□ Runbooks written
□ Disaster recovery plan
□ Backup strategy
□ Rollback procedure
```

---

## 5. ADR Rules

### 5.1 When ADR is Required

**Mandatory ADR for:**

| Decision Type | Example |
|---------------|---------|
| New technology adoption | "Use PostgreSQL" |
| Technology replacement | "Replace RabbitMQ with Kafka" |
| Domain boundary change | "Split Assessment into two domains" |
| Event contract change | "Change AssessmentCreated payload" |
| New architectural pattern | "Introduce CQRS" |
| Breaking API change | "Change /api/v1/assessments response" |
| Security model change | "Switch from JWT to OAuth2" |
| Data model change | "Add new entity type" |
| Integration with external system | "Integrate with Ministry API" |
| Removal of existing capability | "Deprecate Dictation assessment" |

### 5.2 ADR Template

```markdown
# ADR-XXX: [Title]

**Status:** Proposed | Accepted | Deprecated | Superseded  
**Date:** YYYY-MM-DD  
**Deciders:** [who approved]  
**Supersedes:** ADR-YYY (if applicable)

## Context
[What is the issue? Why is a decision needed?]

## Decision
[What is the decision?]

## Rationale
[Why was this decision made? What trade-offs were considered?]

## Alternatives Considered
[What other options were considered and why rejected?]

## Consequences
### Positive
- ...
### Negative
- ...

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| ... | ... | ... |

## Compliance
- [ ] Aligns with Architecture Principles
- [ ] Does not violate Invariants
- [ ] Reviewed by ARB
- [ ] Security review completed
- [ ] Privacy impact assessed

## Implementation Plan
[How will this be implemented? What's the timeline?]

## Review Date
[When should this ADR be revisited?]
```

### 5.3 ADR Lifecycle

```
Proposed → Under Review → Accepted → Implemented → Superseded/Deprecated
```

**Rules:**
- Superseded ADRs must reference the new ADR
- Deprecated ADRs must explain why
- Accepted ADRs are immutable (create new ADR to change)

---

## 6. Architecture Fitness Functions

**Automated tests that run on every build to verify architectural integrity.**

### 6.1 Fitness Function Categories

#### Structural Fitness Functions

```bash
# No circular dependencies
pnpm check:circular
# Expected: 0 violations

# No cross-domain direct imports
pnpm check:boundaries
# Expected: 0 violations

# No forbidden dependencies
pnpm check:dependencies
# Expected: 0 violations

# All files under size limit
pnpm check:file-size
# Expected: all files < 500 lines

# All packages have index.ts
pnpm check:contracts
# Expected: all packages compliant
```

#### Behavioral Fitness Functions

```bash
# AI never writes to DB directly
pnpm check:ai-isolation
# Expected: 0 violations

# All controllers delegate to services
pnpm check:controller-thinness
# Expected: 0 violations

# All DB access via repositories
pnpm check:repository-pattern
# Expected: 0 violations

# No hardcoded curriculum
pnpm check:no-hardcoded-curriculum
# Expected: 0 violations

# All sensitive ops have audit
pnpm check:audit-coverage
# Expected: 100% coverage
```

#### Security Fitness Functions

```bash
# No secrets in code
pnpm check:secrets
# Expected: 0 findings

# All endpoints authenticated
pnpm check:auth-coverage
# Expected: 100% coverage

# No sensitive data in logs
pnpm check:log-safety
# Expected: 0 violations

# Consent checks in place
pnpm check:consent-coverage
# Expected: 100% for sensitive ops
```

#### Quality Fitness Functions

```bash
# Type coverage
pnpm check:type-coverage
# Expected: 100% (no 'any' types)

# Test coverage
pnpm check:coverage
# Expected: >= 80%

# Complexity
pnpm check:complexity
# Expected: all functions < 10

# Dependency freshness
pnpm check:dependencies
# Expected: no critical vulnerabilities
```

### 6.2 Fitness Function Enforcement

**CI/CD Integration:**

```yaml
# .github/workflows/architecture-gate.yml
name: Architecture Fitness Gate

on: [pull_request]

jobs:
  fitness:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Structural Fitness
        run: |
          pnpm check:circular
          pnpm check:boundaries
          pnpm check:dependencies
          pnpm check:file-size
          pnpm check:contracts
      
      - name: Behavioral Fitness
        run: |
          pnpm check:ai-isolation
          pnpm check:controller-thinness
          pnpm check:repository-pattern
          pnpm check:no-hardcoded-curriculum
          pnpm check:audit-coverage
      
      - name: Security Fitness
        run: |
          pnpm check:secrets
          pnpm check:auth-coverage
          pnpm check:log-safety
          pnpm check:consent-coverage
      
      - name: Quality Fitness
        run: |
          pnpm check:type-coverage
          pnpm check:coverage
          pnpm check:complexity
```

**Pre-commit Hooks:**

```json
// package.json
{
  "lint-staged": {
    "*.ts": [
      "eslint",
      "prettier --write"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && pnpm check:local-fitness",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### 6.3 Fitness Function Dashboard

**Real-time dashboard showing:**

| Fitness Function | Status | Last Run | Trend |
|------------------|--------|----------|-------|
| Circular Dependencies | ✅ Pass | 2 min ago | Stable |
| Domain Boundaries | ✅ Pass | 2 min ago | Stable |
| AI Isolation | ✅ Pass | 2 min ago | Stable |
| Audit Coverage | ⚠️ 98% | 2 min ago | Declining |
| Type Coverage | ✅ 100% | 2 min ago | Stable |
| Test Coverage | ✅ 84% | 2 min ago | Improving |

---

## 7. Domain Maturity Levels

**Each domain progresses through defined maturity levels.**

### 7.1 Level Definitions

#### Level 0: Idea
**Definition:** Concept exists, not yet designed.

**Criteria:**
- [ ] Problem statement documented
- [ ] Initial scope defined
- [ ] Stakeholders identified
- [ ] Rough value proposition

**Deliverables:**
- One-page concept note
- Initial ADR (Proposed status)

**Gate to Level 1:** ARB approval of concept

---

#### Level 1: Model
**Definition:** Domain model designed, not implemented.

**Criteria:**
- [ ] Domain model complete (entities, value objects)
- [ ] Ubiquitous language defined
- [ ] Bounded context clear
- [ ] Invariants identified
- [ ] Events cataloged
- [ ] API contracts drafted
- [ ] Data model designed
- [ ] Integration points mapped

**Deliverables:**
- Reference Architecture document (draft)
- Domain model diagrams
- API specification (OpenAPI)
- Data model (ER diagram)
- ADR (Accepted status)

**Gate to Level 2:** ARB approval of design

---

#### Level 2: API
**Definition:** Public API implemented, internal logic stubbed.

**Criteria:**
- [ ] Public API fully implemented
- [ ] API tests passing
- [ ] API documentation published
- [ ] Contract tests passing
- [ ] Integration tests with dependent domains
- [ ] Error handling in place
- [ ] Logging in place

**Deliverables:**
- Working API endpoints
- API documentation
- Contract test suite
- Integration test suite

**Gate to Level 3:** API review + integration test pass

---

#### Level 3: Implementation
**Definition:** Full implementation, not yet in production.

**Criteria:**
- [ ] All business logic implemented
- [ ] All invariants enforced
- [ ] All events published/consumed
- [ ] Security controls applied
- [ ] Performance optimized
- [ ] Unit tests >= 80% coverage
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Documentation complete
- [ ] Code review passed

**Deliverables:**
- Complete implementation
- Full test suite
- Complete documentation
- Performance benchmarks

**Gate to Level 4:** Staging deployment + QA sign-off

---

#### Level 4: Production
**Definition:** Running in production, operational.

**Criteria:**
- [ ] Deployed to production
- [ ] Monitoring in place
- [ ] Alerting configured
- [ ] Health checks passing
- [ ] Runbooks written
- [ ] Disaster recovery tested
- [ ] Backup verified
- [ ] Performance within budget
- [ ] Security audit passed
- [ ] Accessibility audit passed

**Deliverables:**
- Production deployment
- Operational runbooks
- Monitoring dashboards
- Incident response plan

**Gate to Level 5:** 3 months stable operation + scale testing

---

#### Level 5: National Scale
**Definition:** Proven at national scale, ready for ministry deployment.

**Criteria:**
- [ ] Tested with 1M+ users
- [ ] Multi-tenant operation verified
- [ ] Cross-region deployment working
- [ ] Compliance with ministry standards
- [ ] Accreditation requirements met
- [ ] Performance at scale verified
- [ ] Security at scale verified
- [ ] Support model operational
- [ ] Training materials complete
- [ ] Localization complete

**Deliverables:**
- Scale test reports
- Compliance certificates
- Training program
- Support documentation
- Localization packages

---

### 7.2 Maturity Tracking

**Dashboard view:**

| Domain | Level | Status | Next Gate | Owner |
|--------|-------|--------|-----------|-------|
| Identity | L4 | ✅ Production | Scale test | @ali |
| Assessment | L3 | 🔄 Implementation | Staging deploy | @sara |
| Evidence | L3 | 🔄 Implementation | Staging deploy | @mohamed |
| Curriculum | L2 | 📝 API | Integration tests | @fatima |
| AI | L2 | 📝 API | Integration tests | @ahmed |
| Student Digital Twin | L1 | 🎨 Model | ARB approval | @noor |
| Knowledge Graph | L1 | 🎨 Model | ARB approval | @khaled |
| Adaptive Learning | L0 | 💡 Idea | Concept note | @layla |
| Therapeutic | L3 | 🔄 Implementation | Staging deploy | @omar |
| Intervention | L2 | 📝 API | Integration tests | @huda |

---

## 8. Change Control Process

### 8.1 Change Categories

| Category | Examples | Approval Required |
|----------|----------|-------------------|
| **Constitutional** | Change principles, invariants, layers | Architecture Owner + all stakeholders |
| **Major** | New domain, boundary change, tech replacement | ARB + ADR |
| **Minor** | New rule, documentation update | Architecture Owner |
| **Trivial** | Typo fix, clarification | Domain Owner |

### 8.2 Change Process

```
1. PROPOSE
   → Any developer can propose
   → Submit via GitHub Issue or PR
   
2. CLASSIFY
   → ARB classifies change category
   → Determine required approval
   
3. DESIGN
   → For Major/Constitutional: Create ADR
   → For Minor/Trivial: Direct proposal
   
4. REVIEW
   → ARB reviews (Major/Constitutional)
   → Domain Owner reviews (Minor/Trivial)
   → Public comment period (7 days for Constitutional)
   
5. DECIDE
   → Approve / Reject / Request Changes
   → Document decision rationale
   
6. IMPLEMENT
   → Update documentation
   → Update code if needed
   → Update fitness functions if needed
   
7. COMMUNICATE
   → Announce to all developers
   → Update training materials
   → Update onboarding docs
   
8. VERIFY
   → Fitness functions pass
   → No regressions
   → Monitor for 30 days
```

---

## 9. Exception Management

### 9.1 When Exceptions Are Allowed

**Exceptions are RARE and require:**

1. **Strong justification** - Why the rule cannot be followed
2. **Time-boxed** - Maximum duration (typically 1 sprint)
3. **Owner assigned** - Who is responsible for resolution
4. **Mitigation plan** - How to minimize impact
5. **Resolution plan** - How and when to become compliant

### 9.2 Exception Request Template

```markdown
# Exception Request: [Brief Description]

**Requested by:** [Name]  
**Date:** YYYY-MM-DD  
**Duration requested:** [e.g., 2 sprints]  
**Rule being exempted:** [Rule number/name]

## Justification
[Why can't we follow the rule in this case?]

## Impact Analysis
[What happens if we don't get this exception?]
[What happens if we grant it?]

## Mitigation Plan
[How will we minimize the impact of this exception?]

## Resolution Plan
[How and when will we become compliant?]

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ... | ... | ... | ... |

## Approval
- [ ] Domain Owner
- [ ] ARB Member
- [ ] Architecture Owner (for major exceptions)
```

### 9.3 Exception Tracking

**All exceptions tracked in:**
- GitHub Issues labeled `exception`
- Exception register document
- Quarterly review by ARB

**Rules:**
- No exception > 2 sprints without ARB re-approval
- All exceptions reviewed quarterly
- Repeat exceptions trigger rule review

---

## 10. Compliance Monitoring

### 10.1 Automated Monitoring

**Continuous monitoring via:**

- CI/CD fitness functions (every PR)
- Nightly architecture scans
- Weekly compliance reports
- Monthly ARB review

### 10.2 Manual Monitoring

**Periodic reviews:**

- **Weekly:** Tech lead spot-checks
- **Monthly:** Domain owner reviews
- **Quarterly:** ARB comprehensive audit
- **Annually:** Full architecture review

### 10.3 Compliance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Fitness function pass rate | 100% | CI/CD |
| ADR compliance | 100% | Manual audit |
| Exception count | < 5 active | Exception register |
| Domain maturity progression | +1 level/quarter | Maturity dashboard |
| Architecture violations | 0 | Code review + automated |

---

## 11. Governance Cadence

### 11.1 Regular Meetings

| Meeting | Frequency | Attendees | Purpose |
|---------|-----------|-----------|---------|
| **Architecture Office Hours** | Weekly (1h) | All developers | Q&A, informal reviews |
| **ARB Meeting** | Bi-weekly (2h) | ARB members | ADR reviews, major decisions |
| **Domain Sync** | Weekly (30m) | Domain owners | Cross-domain coordination |
| **Quarterly Audit** | Quarterly (full day) | ARB + stakeholders | Comprehensive review |
| **Annual Review** | Annually (2 days) | All stakeholders | Strategic direction |

### 11.2 Reporting

**Weekly Report:**
- Fitness function status
- Active exceptions
- ADR pipeline
- Maturity progress

**Monthly Report:**
- Architecture health score
- Violations summary
- Improvement initiatives
- Risk register update

**Quarterly Report:**
- Full compliance audit
- Maturity dashboard
- Strategic initiatives
- Budget/resource needs

---

## 12. Consequences of Violations

### 12.1 Violation Severity

| Severity | Examples | Response |
|----------|----------|----------|
| **Critical** | Security breach, data loss, AI making decisions | Immediate block, incident response |
| **Major** | Domain boundary violation, missing audit | PR blocked until fixed |
| **Minor** | File too long, missing docs | Code review comment |
| **Trivial** | Style issues | Automated fix |

### 12.2 Escalation Path

```
1. Developer self-corrects (automated tools)
   ↓
2. Tech lead flags in code review
   ↓
3. Domain owner escalates
   ↓
4. ARB intervention
   ↓
5. Architecture Owner decision
   ↓
6. Executive escalation (rare)
```

### 12.3 Repeated Violations

**Pattern of violations triggers:**
- Root cause analysis
- Training intervention
- Process improvement
- Possible reassignment

---

## Appendix A: Quick Reference Card

### For Developers

**Before submitting PR:**
1. Run `pnpm check:all` locally
2. Check Architecture Review Checklist (Section 3)
3. Ensure ADR exists if needed
4. Document any exceptions

**When in doubt:**
1. Check ARCHITECTURE.md
2. Check relevant Reference Architecture
3. Ask in Architecture Office Hours
4. Consult Domain Owner

### For Tech Leads

**Reviewing PR:**
1. Run Architecture Review Checklist
2. Verify fitness functions pass
3. Check Domain Acceptance criteria
4. Approve or request changes

### For ARB Members

**Reviewing ADR:**
1. Check alignment with principles
2. Verify no invariant violations
3. Assess risks and mitigations
4. Approve/reject with rationale

---

## Appendix B: Tools & Automation

| Tool | Purpose | Command |
|------|---------|---------|
| dependency-cruiser | Dependency validation | `pnpm check:dependencies` |
| madge | Circular dependency detection | `pnpm check:circular` |
| eslint-plugin-boundaries | Layer enforcement | `pnpm lint` |
| custom scripts | Domain-specific checks | `pnpm check:*` |
| GitHub Actions | CI/CD enforcement | Automatic on PR |
| SonarQube | Code quality | Automatic analysis |
| Custom dashboard | Compliance visibility | Internal URL |

---

## Appendix C: Related Documents

- **ARCHITECTURE.md** - The constitution itself
- **Reference Architecture docs** - Per-domain deep dives
- **ADR directory** - All architectural decisions
- **Rules directory** - All engineering rules
- **Exception register** - Active exceptions

---

**End of Architecture Governance**

**Document Owner:** Architecture Review Board  
**Next Review:** 2026-10-13  
**Amendment Policy:** See ARCHITECTURE.md Section 33
