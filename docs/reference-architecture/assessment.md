```markdown
# Assessment Domain - Reference Architecture

## 1. Purpose & Scope
**In:** Assessment creation, execution, grading, validation, reporting.
**Out:** Scores, feedback, evidence, AI recommendations, teacher decisions.
**Excluded:** Content creation (Curriculum), User management (Identity), File storage (Storage).

## 2. Domain Model
```typescript
interface Assessment {
  id: AssessmentId;
  type: AssessmentType; // reading | dictation | writing | math | science | speaking
  config: AssessmentConfig;
  status: AssessmentStatus;
  createdBy: TeacherId;
  assignedTo: StudentId | ClassId;
}

interface AssessmentEvidence {
  id: EvidenceId;
  type: EvidenceType; // audio | text | image | file
  storageUrl: string;
  immutableHash: string;
  metadata: EvidenceMetadata;
}
```

## 3. Data Model
```sql
CREATE TABLE assessments (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('reading','dictation','writing','math','science','speaking')),
  config JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  teacher_id TEXT REFERENCES teachers(id),
  class_id TEXT REFERENCES classes(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assessment_evidence (
  id TEXT PRIMARY KEY,
  assessment_id TEXT REFERENCES assessments(id),
  storage_url TEXT NOT NULL,
  immutable_hash TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 4. API Contracts
```http
POST /api/v1/assessments
GET  /api/v1/assessments/{id}
POST /api/v1/assessments/{id}/submit
POST /api/v1/assessments/{id}/grade
POST /api/v1/assessments/{id}/validate
```

## 5. Events
```typescript
AssessmentCreated { assessmentId, type, config }
AssessmentStarted { assessmentId, studentId, startedAt }
AssessmentCompleted { assessmentId, evidenceIds, completedAt }
AIAnalysisGenerated { assessmentId, recommendations, confidence }
TeacherValidated { assessmentId, finalScore, feedback }
```

## 6. Business Rules
- AI recommendations NEVER become official without teacher validation
- Evidence is immutable once uploaded (hash verified)
- Adaptive Playback config enforced per activity
- Teacher override logged with rationale

## 7. Cross-Domain Integration
- Consumes: Curriculum (content), Identity (roles), AI (analysis)
- Publishes: Reporting (results), Therapeutic (triggers), Notification (alerts)
- Anti-Corruption: Maps AI confidence scores to pedagogical decisions

## 8. Performance
- P95 submission latency: < 200ms
- Evidence upload: chunked, resumable, max 100MB
- Cache: assessment config TTL 1h, student state TTL 5m

## 9. Security
- RBAC: Students submit, Teachers validate, Admins audit
- Evidence encrypted at rest (AES-256) & in transit (TLS 1.3)
- Consent checked for audio/video evidence

## 10. Testing
- Unit: AI scoring logic, playback config validation
- Integration: Evidence upload → AI analysis → Teacher validation flow
- E2E: Full assessment lifecycle with offline sync recovery

## 11. Deployment
- Zero-downtime migrations via expand/contract pattern
- Feature flags for new assessment types
- Rollback window: 15 minutes post-deploy

## 12. Versioning
- API: `/api/v1/` → `/api/v2/` on breaking changes
- Assessment config versioned independently
- Evidence schema immutable; extensions via metadata JSONB
```
