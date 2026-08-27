# Functional Requirements — BuyTuk Educational Platform

**Status:** Accepted  
**Date:** 2026-07-13  
**Version:** 1.0  
**Related ADR:** ADR-022

---

## Overview

These functional requirements are **mandatory** for the platform. They define the core capabilities that distinguish BuyTuk from generic educational software.

---

## 1. Reading Assessment Configuration

| Requirement | Detail |
|-------------|--------|
| Text visibility | Configurable per activity by teacher |
| Audio recording | Always recorded, regardless of text visibility |
| AI analysis | Runs regardless of text visibility |
| Result validation | Teacher must approve AI assessment results |

### Workflow
1. Teacher creates reading activity → configures text visibility
2. Student reads → audio recorded automatically
3. AI analyses: fluency, pronunciation, mastery, pauses, speed, articulation, errors
4. AI highlights error words
5. Teacher reviews AI report → approves or modifies
6. Result stored as official assessment

---

## 2. Dictation (الإملاء) Flexibility

| Source Type | Who Creates | How |
|------------|-------------|-----|
| Teacher voice | Teacher | Record directly in platform |
| Uploaded file | Teacher | Upload MP3/WAV/M4A |
| AI voice | System | Generate from text via TTS |

### Dictation Rules
- Student NEVER sees the text — only hears audio
- Student writes what they hear
- System auto-corrects against the original text
- Error classification:
  - Spelling errors (أخطاء إملائية)
  - Missing words (كلمات محذوفة)
  - Extra words (كلمات زائدة)
  - Hamza errors (أخطاء الهمزة)
  - Ta marbuta errors (أخطاء التاء المربوطة)
  - Alif layyina errors (أخطاء الألف اللينة)
  - Punctuation errors (أخطاء الترقيم)
- System suggests therapeutic exercises per error type

---

## 3. Assessment Types (All Mandatory)

| Type | Arabic | AI Analysis | Human Validation |
|------|--------|-------------|-----------------|
| Reading | القراءة | Fluency, pronunciation, speed | Teacher |
| Dictation | الإملاء | Error classification, correction | Teacher |
| Pronunciation | النطق | Phoneme accuracy, clarity | Teacher or Speech therapist |
| Fluency | الطلاقة | Words-per-minute, pauses | Teacher |
| Comprehension | الفهم | Question accuracy, inference | Teacher |
| Handwriting | الخط | Stroke analysis, letter formation | Teacher |
| Writing Composition | التعبير الكتابي | Grammar, vocabulary, coherence, structure | Teacher |

---

## 4. Learning Difficulty Detection & Treatment

### Detectable Difficulties

| Difficulty | Arabic | Key Indicators | Specialist |
|-----------|--------|---------------|-----------|
| Stuttering | التأتأة | Word repetition, blocks, prolongations | Speech therapist |
| Lisps | اللدغات | Phoneme substitution patterns | Speech therapist |
| Speech Difficulties | صعوبات النطق | Articulation errors, intelligibility | Speech therapist |
| Dyslexia | عسر القراءة | Letter reversal, omission, substitution | Psychologist |
| Dysgraphia | عسر الكتابة | Letter formation, spacing, pressure | Psychologist |
| Language Delay | التأخر اللغوي | Vocabulary, syntax, comprehension age-gap | Psychologist |

### Treatment Plan Lifecycle
```
Detection (AI) → Specialist Review → Plan Creation → Implementation
→ Progress Monitoring → Re-assessment → Plan Adjustment → Closure
```

### Treatment Plan Components
- Initial assessment date
- Detected difficulties (with evidence)
- Short-term goals (weekly)
- Long-term goals (monthly/quarterly)
- Assigned specialist(s)
- Parent communication log
- Progress measurements (percentage improvement)
- Re-assessment schedule
- Plan status (active / completed / transferred)

---

## 5. Support Team Roles

### Social Guide / Supervisor (مرشد/مشرف اجتماعي)

**Permissions:**
- Create and manage social intervention cases
- Log behavioral observations
- Send parent notifications
- Coordinate with class teachers
- View student social/behavioral history
- **Cannot** access psychological assessment data

**Typical Workflow:**
1. Teacher flags behavioral concern
2. Social guide opens case → documents observations
3. Contacts parent → logs communication
4. Creates intervention plan
5. Monitors resolution → closes case

### School Psychologist (أخصائي/طبيب نفسي مدرسي)

**Permissions:**
- Full access to psychological assessment history
- Create and modify therapeutic plans
- Add sensitive psychological notes (restricted to specialists)
- View learning difficulty diagnostic reports
- Issue referrals to external services
- **Cannot** access financial/billing data

**Sensitive Data Protection:**
- Psychological notes are encrypted at rest
- Access logged in audit trail
- Parent consent required before sharing externally

---

## 6. Educational Equity

### Eligibility Categories

| Category | Arabic | Approval Authority |
|----------|--------|-------------------|
| Orphan | يتيم | School admin |
| Humanitarian case | حالة إنسانية | Tenant admin |
| Financial hardship | صعوبة مالية | Tenant admin |

### Grant Rules
- Eligible students receive **full feature access** — no feature gating
- Administrative approval workflow with audit trail
- Renewable annually
- Parent/guardian must be informed

---

## 7. AI Authority Boundary

> **This rule has NO exceptions.**

```
AI Output → [RECOMMENDATION] → Human Review → [APPROVAL] → Official Record
                                     ↓
                              [REJECTION/MODIFICATION]
                                     ↓
                              Alternative assessment
```

All AI outputs must be:
1. Clearly labelled as "AI suggestion" in the UI
2. Require explicit approval action before becoming official
3. Stored with who approved, when, and any modifications made
4. Never sent to parents or guardians without human approval

---

*Full details in ARCHITECTURE.md Section 15*
