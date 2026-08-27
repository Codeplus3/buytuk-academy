# 🔌 BuyTuk Educational Platform - API Standards

**Version:** 1.0.0  
**Last Updated:** 2026-07-13  
**Status:** Final / Production Ready  
**Authority:** API Governance Board  
**Document ID:** API-001

---

## 📋 Document Control

| Attribute | Value |
|-----------|-------|
| **Document Owner** | Platform Architecture Team |
| **Review Cycle** | Quarterly |
| **Next Review** | 2026-10-13 |
| **Related Documents** | ARCHITECTURE.md, DATABASE-STANDARDS.md, EVENT-ARCHITECTURE.md, BOUNDED-CONTEXT.md |

---

## 1. Executive Summary

This document defines the mandatory standards, conventions, and best practices for designing, developing, documenting, and consuming APIs within the BuyTuk Educational Platform. All services **MUST** adhere to these standards to ensure consistency, security, performance, and developer experience across the platform.

---

## 2. Core Principles (Non-Negotiable)

| # | Principle | Description |
|---|-----------|-------------|
| P1 | **Resource-Oriented** | APIs expose resources (nouns), not actions (verbs) |
| P2 | **Stateless** | Each request must contain all information needed to process it |
| P3 | **Consistent** | Naming, structure, and behavior must be uniform across all services |
| P4 | **Secure by Default** | Authentication, authorization, and input validation are mandatory |
| P5 | **Versioned** | All APIs must be explicitly versioned to prevent breaking changes |
| P6 | **Documented** | OpenAPI 3.0 specification required before implementation |
| P7 | **Observable** | All endpoints must emit metrics, traces, and structured logs |

---

## 3. URL Structure & Naming Conventions

### 3.1 Base URL Format

```
/api/v{major-version}/{resource}
```

**Examples:**
```
GET  /api/v1/users
GET  /api/v1/assessments
POST /api/v1/assessments/{assessmentId}/submissions
```

### 3.2 Resource Naming Rules

| Rule | ✅ Correct | ❌ Wrong |
|------|-----------|---------|
| Plural nouns for collections | `/assessments` | `/assessment` |
| lowercase + kebab-case | `/learning-objectives` | `/learningObjectives`, `/learning_objectives` |
| No verbs in URLs | `GET /users/{id}` | `/getUser/{id}` |
| No underscores | `/grade-levels` | `/grade_levels` |

### 3.3 Ubiquitous Language in URLs

URLs **MUST** use the [Ubiquitous Language](UBIQUITOUS-LANGUAGE.md) terms:

```
-- ✅ Correct
GET  /api/v1/assessments
POST /api/v1/assessments/{assessmentId}/submissions
GET  /api/v1/interventions/{interventionId}/progress-notes
GET  /api/v1/students/{studentId}/enrollments

-- ❌ Wrong (forbidden terms)
GET  /api/v1/tests
POST /api/v1/exams/{id}/attempts
GET  /api/v1/supports/{id}/notes
GET  /api/v1/students/{id}/registrations
```

### 3.4 Nested Resources

Use nested resources only for strict ownership or containment. **Maximum 2 levels deep.**

```
-- ✅ Good
GET /api/v1/assessments/{assessmentId}/submissions
GET /api/v1/students/{studentId}/enrollments

-- ❌ Too deep — use query parameters instead
GET /api/v1/tenants/{tenantId}/schools/{schoolId}/classes/{classId}/students

-- ✅ Correct alternative
GET /api/v1/students?schoolId={schoolId}&classId={classId}
```

---

## 4. HTTP Methods & Status Codes

### 4.1 Standard HTTP Methods

| Method | Purpose | Idempotent | Safe | Example |
|--------|---------|------------|------|---------|
| `GET` | Retrieve a resource or collection | Yes | Yes | `GET /api/v1/users/{id}` |
| `POST` | Create a new resource | No | No | `POST /api/v1/assessments` |
| `PUT` | Replace an entire resource | Yes | No | `PUT /api/v1/users/{id}` |
| `PATCH` | Partially update a resource | No* | No | `PATCH /api/v1/users/{id}` |
| `DELETE` | Soft-delete a resource | Yes | No | `DELETE /api/v1/users/{id}` |

*\* PATCH is idempotent only when applied with the exact same payload repeatedly.*

> **Note:** `DELETE` always performs a **soft delete** (sets `deleted_at`) — never a physical deletion. See [DATABASE-STANDARDS.md](DATABASE-STANDARDS.md) Section 10.

### 4.2 Standard HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| `200` | OK | Successful `GET`, `PUT`, `PATCH` |
| `201` | Created | Successful `POST` (must include `Location` header) |
| `204` | No Content | Successful `DELETE` with no response body |
| `400` | Bad Request | Invalid input, schema validation failure (Zod) |
| `401` | Unauthorized | Missing or invalid authentication token |
| `403` | Forbidden | Authenticated but lacks permission |
| `404` | Not Found | Resource does not exist or is soft-deleted |
| `409` | Conflict | Resource already exists or version conflict |
| `422` | Unprocessable Entity | Valid syntax, but business rule / domain invariant failure |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server failure |
| `503` | Service Unavailable | Service is down or in maintenance |

---

## 5. Request & Response Formats

### 5.1 Content Types

- **Request body:** `application/json` (except file uploads: `multipart/form-data`)
- **Response:** `application/json`
- **Charset:** `UTF-8` always

### 5.2 Standard Response Envelope

**Single Resource:**
```json
{
  "data": {
    "id": "usr_0194abcd-ef56-7890",
    "fullName": "Ahmed Al-Mansouri",
    "status": "active",
    "createdAt": "2026-07-13T10:30:00Z",
    "updatedAt": "2026-07-13T10:30:00Z"
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-07-13T10:30:05Z"
  }
}
```

**Collection (cursor-paginated):**
```json
{
  "data": [
    { "id": "asm_001", "title": "Reading Assessment — Grade 5" },
    { "id": "asm_002", "title": "Dictation Assessment — Term 1" }
  ],
  "pagination": {
    "cursor": "eyJpZCI6ImFzbV8wMDIifQ==",
    "limit": 20,
    "hasNext": true,
    "hasPrevious": false
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-07-13T10:30:05Z"
  }
}
```

### 5.3 Standard Error Response

```json
{
  "error": {
    "code": "ASM-0001",
    "message": "Assessment not found",
    "statusCode": 404,
    "metadata": {
      "assessmentId": "asm_123"
    },
    "timestamp": "2026-07-13T10:30:05Z",
    "traceId": "0af7651916cd43dd8448eb211c80319c"
  }
}
```

Error codes follow the `{SERVICE_PREFIX}-{NNNN}` format (e.g., `ASM-0001`, `STU-0042`, `AI-0010`).

---

## 6. Filtering, Sorting & Pagination

### 6.1 Pagination — Cursor-Based (Mandatory)

Offset pagination (`page`/`offset`) is **prohibited** for large datasets. Use cursor-based pagination for all collection endpoints.

```http
GET /api/v1/assessments?limit=20&cursor=eyJpZCI6ImFzbV8wMDEifQ==
```

### 6.2 Filtering

Simple filters as query parameters; bracket notation for complex/nested filters:

```http
GET /api/v1/assessments?type=writing&status=published
GET /api/v1/students?filter[gradeLevel]=10&filter[enrollmentStatus]=active
```

Valid filter values must match the Ubiquitous Language enums (e.g., `type=assessment` not `type=test`).

### 6.3 Sorting

Use `sort` parameter. Prefix with `-` for descending.

```http
GET /api/v1/assessments?sort=-createdAt,title
```

*(Sorts by `createdAt` descending, then `title` ascending.)*

---

## 7. Authentication & Authorization

### 7.1 Authentication

| Setting | Value |
|---------|-------|
| Mechanism | Bearer Token (JWT) |
| Header | `Authorization: Bearer <token>` |
| Access Token Lifespan | 15 minutes |
| Refresh Token Lifespan | 7 days |

### 7.2 Authorization

- **Model:** RBAC (Role-Based) + ABAC (Attribute-Based)
- **Enforcement:** API Gateway validates JWT signature; each microservice validates resource-level permissions via IAM service
- **Rule:** A valid token alone is NOT sufficient — the service must verify the caller has the required `Permission` for the specific resource

### 7.3 Multi-Tenancy

```http
X-Tenant-ID: <tenant_uuid>    -- Optional if already embedded in JWT claims
```

**Enforcement:** All database queries MUST include `WHERE tenant_id = ?`. See [DATABASE-STANDARDS.md](DATABASE-STANDARDS.md) Section 6.

---

## 8. Rate Limiting & Throttling

All APIs are protected by rate limits communicated via response headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1720000000
```

**Default Tiers:**

| Endpoint Type | Limit |
|---------------|-------|
| Auth/Public endpoints | 10 req / minute |
| Standard Read (`GET`) | 100 req / minute |
| Standard Write (`POST`, `PUT`, `PATCH`) | 30 req / minute |
| Bulk/Export endpoints | 5 req / minute |
| AI Analysis endpoints | 10 req / minute |

---

## 9. Versioning Strategy

### 9.1 URL Versioning (Primary)

```http
GET /api/v1/users
GET /api/v2/users
```

### 9.2 Versioning Rules

| Change Type | Action |
|------------|--------|
| **Breaking change** (remove fields, change types, rename) | New major version (`v1` → `v2`) |
| **Non-breaking** (add optional fields, new endpoints) | Same version |
| **Deprecation** | Old version supported min. **6 months** with deprecation headers |

```http
Warning: 299 - "This API version is deprecated. Please migrate to /api/v2/ by 2027-01-01."
```

---

## 10. Security Requirements

### 10.1 Mandatory Response Headers

All responses MUST include:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Cache-Control: no-store, no-cache, must-revalidate
```

### 10.2 Input Validation

- All request bodies and query parameters MUST be validated with **Zod** schemas before reaching business logic
- Use `strict()` mode — reject unknown/extra fields
- Sanitize all string inputs to prevent XSS

```typescript
// ✅ Correct — validate at the route handler entry point
const body = CreateAssessmentSchema.parse(req.body);  // throws ZodError on failure

// ❌ Wrong — using raw req.body directly
await assessmentService.create(req.body);
```

### 10.3 SQL Injection Prevention

- Use parameterized queries exclusively — handled by Drizzle ORM
- Never concatenate user input into query strings
- Never use raw SQL with user-controlled values

---

## 11. Documentation (OpenAPI 3.0)

### 11.1 Requirements

- Every service MUST have an `openapi.yaml` in its root directory
- Documentation MUST be updated alongside code changes (enforced by CI)
- All endpoints, parameters, request/response bodies, and error codes MUST be documented
- The `lib/api-spec` package in this monorepo is the source of truth for the shared API specification

### 11.2 OpenAPI Snippet Example

```yaml
paths:
  /api/v1/assessments:
    post:
      summary: Create a new assessment
      operationId: createAssessment
      tags:
        - Assessments
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAssessmentRequest'
      responses:
        '201':
          description: Assessment created successfully
          headers:
            Location:
              schema:
                type: string
              description: URL of the created assessment
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AssessmentResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/UnprocessableEntity'
```

---

## 12. File Uploads & Downloads

### 12.1 Uploads

- Use `multipart/form-data`
- Maximum file size: **50 MB** (configurable per service)
- Allowed MIME types must be explicitly validated (e.g., `audio/mpeg`, `audio/wav`, `application/pdf`, `video/mp4`)
- Files are uploaded to a presigned object storage URL — **never** to the API server directly
- All uploads are virus-scanned before being associated with an `Evidence` record

### 12.2 Downloads

- Return a presigned, time-limited URL in the response — never stream the file binary through the API
- Use `Content-Disposition: attachment; filename="..."` for direct download responses

---

## 13. Testing & Mocking

### 13.1 Contract Testing

All inter-service communication MUST be validated using contract testing (Pact or compatible) to catch API compatibility breakage before deployment.

### 13.2 Mocking

Development and CI environments MUST use mock servers (Prism or WireMock) based on the OpenAPI specification to enable parallel frontend/backend development.

---

## 14. API Design Checklist

Before merging any API-related change, verify:

- [ ] URL uses resource-oriented, kebab-case, plural nouns from the Ubiquitous Language
- [ ] Correct HTTP method and status code used
- [ ] Request/Response follows the standard envelope format
- [ ] Cursor-based pagination implemented for all collection endpoints
- [ ] Input validation (Zod strict mode) in place before business logic
- [ ] Error response matches the standard error format with service error code
- [ ] OpenAPI specification updated in `lib/api-spec`
- [ ] Rate limiting configured
- [ ] Security headers present in all responses
- [ ] Auth check validates both JWT AND resource-level permission
- [ ] Unit and integration tests cover the new endpoint
- [ ] No forbidden Ubiquitous Language terms in URL or field names

---

## 15. Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-01-25 | Initial draft |
| 0.5.0 | 2026-04-10 | Added cursor pagination mandate; file upload rules |
| 1.0.0 | 2026-07-13 | Final release, aligned with Constitution and Ubiquitous Language |

---

**Document ID:** API-001 | **Owner:** Platform Architecture Team
