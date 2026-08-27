# 🗄️ BuyTuk Educational Platform - Database Standards

**Version:** 1.0.0  
**Last Updated:** 2026-07-13  
**Status:** Final / Production Ready  
**Authority:** Database Architecture Board  
**Classification:** Internal / Engineering

---

## 📋 Document Control

| Attribute | Value |
|-----------|-------|
| **Document Owner** | Platform Architecture Team & Database Team |
| **Review Cycle** | Quarterly |
| **Next Review** | 2026-10-13 |
| **Approval Authority** | CTO & Lead Database Architects |
| **Related Documents** | ARCHITECTURE.md, functional-requirements.md, EVENT-ARCHITECTURE.md |

---

## 1. Executive Summary

This document defines the mandatory standards, conventions, and best practices for designing, developing, migrating, and operating relational databases within the BuyTuk Educational Platform. All services **MUST** adhere to these standards to ensure consistency, performance, security, multi-tenancy, and maintainability across the platform.

The platform uses **PostgreSQL 15+** as the primary relational database, accessed via **Drizzle ORM**, with strict enforcement of multi-tenancy through **Row-Level Security (RLS)**.

---

## 2. Core Principles (Non-Negotiable)

| # | Principle | Description |
|---|-----------|-------------|
| P1 | **Single Source of Truth** | Each piece of data is owned by exactly one service. Cross-service references use IDs only. |
| P2 | **Multi-Tenancy by Design** | Every tenant-scoped table MUST enforce isolation via RLS and `tenant_id` filtering. |
| P3 | **Immutability of History** | Data is never physically deleted. Use soft deletes and audit trails. |
| P4 | **Type Safety** | Use PostgreSQL's strong typing. Avoid `TEXT` for structured data; use proper types. |
| P5 | **Performance by Design** | Indexes, partitioning, and query optimization are part of schema design, not afterthoughts. |
| P6 | **Security by Default** | Encryption at rest and in transit, column-level encryption for PII, least privilege access. |
| P7 | **Schema as Code** | All schema changes are versioned, reversible, and applied via Drizzle migrations. |

---

## 3. Naming Conventions

### 3.1 General Rules

- ✅ Use **lowercase letters** and **snake_case** for all identifiers
- ✅ Use **plural nouns** for table names
- ✅ Use **singular nouns** for column names representing a single value
- ❌ Never use reserved PostgreSQL keywords as identifiers
- ❌ Never use abbreviations (except universally accepted ones: `id`, `url`, `ip`)

### 3.2 Table Names

**Format:** `{domain_prefix}_{entity_plural}`

| ✅ Good | ❌ Bad | Reason |
|---------|--------|--------|
| `identity_users` | `Users` | PascalCase, singular |
| `assessment_submissions` | `assessmentSubmissions` | camelCase |
| `student_enrollments` | `student_enrollment` | Singular |

**Domain Prefixes:**

| Prefix | Domain |
|--------|--------|
| `identity_` | Identity & Auth |
| `iam_` | Roles & Permissions |
| `student_` | Student |
| `teacher_` | Teacher |
| `assessment_` | Assessment |
| `submission_` | Submission |
| `intervention_` | Intervention / Treatment Plans |
| `evidence_` | Evidence & Recordings |
| `ai_` | AI Analysis |
| `curriculum_` | CMS / Curriculum |
| `school_` | School / Tenant |
| `communication_` | Notifications & Messaging |
| `reporting_` | Reports & Analytics |

### 3.3 Column Names

| Type | Convention | Example |
|------|------------|---------|
| Primary Key | `id` | `id UUID PRIMARY KEY` |
| Foreign Key | `{referenced_entity_singular}_id` | `tenant_id`, `user_id`, `assessment_id` |
| Boolean | Prefix with `is_`, `has_`, `can_` | `is_active`, `has_mfa`, `can_publish` |
| Timestamp | Suffix with `_at` | `created_at`, `updated_at`, `deleted_at` |
| Date (no time) | Suffix with `_date` | `birth_date`, `start_date` |
| Count/Quantity | Suffix with `_count` or `_total` | `attempt_count`, `total_score` |
| JSON/JSONB | Use descriptive noun | `metadata`, `settings`, `configuration` |

### 3.4 Index Names

**Format:** `idx_{table}_{column(s)}_{modifier}`

| ✅ Good | ❌ Bad |
|---------|--------|
| `idx_users_email` | `users_email_index` |
| `idx_submissions_tenant_created` | `idx_sub_tenant_created` |
| `idx_assessments_status_active` | `idx_status` |

**Modifiers:** `_unique`, `_partial`, `_desc`, `_gin`, `_gist`

### 3.5 Constraint Names

| Constraint | Format | Example |
|------------|--------|---------|
| Primary Key | `{table}_pkey` | `users_pkey` |
| Foreign Key | `{table}_{column}_fkey` | `users_tenant_id_fkey` |
| Unique | `{table}_{column}_key` | `users_email_key` |
| Check | `{table}_{column}_check` | `users_status_check` |

### 3.6 Enum Names

**Format:** `{domain}_{entity}_{attribute}`

| ✅ Good | ❌ Bad |
|---------|--------|
| `user_status` | `status` |
| `assessment_type` | `type` |
| `submission_status` | `sub_status` |

---

## 4. Standard Columns (Mandatory)

Every tenant-scoped table **MUST** include:

```sql
CREATE TABLE assessment_assessments (
  -- Primary Key (UUID)
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-Tenancy (mandatory)
  tenant_id UUID NOT NULL REFERENCES identity_tenants(id),

  -- Business columns go here...

  -- Audit Fields (mandatory)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  version    INTEGER NOT NULL DEFAULT 1,

  -- Recommended
  created_by UUID REFERENCES identity_users(id),
  updated_by UUID REFERENCES identity_users(id),
  metadata   JSONB DEFAULT '{}'::jsonb
);
```

### 4.1 Column Definitions

| Column | Type | Nullable | Purpose |
|--------|------|----------|---------|
| `id` | `UUID` | NO | Primary key |
| `tenant_id` | `UUID` | NO | Multi-tenancy boundary |
| `created_at` | `TIMESTAMPTZ` | NO | Creation timestamp (UTC) |
| `updated_at` | `TIMESTAMPTZ` | NO | Last modification (UTC) |
| `deleted_at` | `TIMESTAMPTZ` | YES | Soft delete marker (`NULL` = active) |
| `version` | `INTEGER` | NO | Optimistic concurrency control |
| `created_by` | `UUID` | YES | User who created the record |
| `updated_by` | `UUID` | YES | User who last modified |
| `metadata` | `JSONB` | YES | Extensible unstructured data |

---

## 5. Data Types

### 5.1 Primary Keys

**Mandatory:** Use `UUID` with `gen_random_uuid()`.

```sql
-- ✅ Good
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- ❌ Bad — Not safe for distributed systems
id SERIAL PRIMARY KEY
```

### 5.2 Standard Type Mappings

| Business Concept | PostgreSQL Type | TypeScript Type |
|------------------|-----------------|-----------------|
| Identifier | `UUID` | `string` |
| Short/Long String | `TEXT` | `string` |
| Integer | `INTEGER` | `number` |
| Decimal/Money | `NUMERIC(p,s)` | `string` |
| Boolean | `BOOLEAN` | `boolean` |
| Date | `DATE` | `string` (ISO 8601) |
| Timestamp | `TIMESTAMPTZ` | `string` |
| JSON | `JSONB` | `object` |
| Encrypted Data | `BYTEA` | `Buffer` |

### 5.3 Prohibited Types

| ❌ Prohibited | ✅ Alternative | Reason |
|---------------|----------------|--------|
| `SERIAL` | `UUID` + `gen_random_uuid()` | Not safe for distributed systems |
| `VARCHAR(n)` | `TEXT` | PostgreSQL optimizes `TEXT` equally |
| `FLOAT`, `REAL` | `NUMERIC(p,s)` | Precision loss for money/grades |
| `DATETIME` | `TIMESTAMPTZ` | No time zone support |

---

## 6. Multi-Tenancy & Row-Level Security (RLS)

### 6.1 Mandatory RLS Policy

Every tenant-scoped table **MUST** enable RLS:

```sql
ALTER TABLE assessment_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_assessments FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON assessment_assessments
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### 6.2 Setting Tenant Context

```typescript
// lib/db/src/client.ts
export async function withTenantContext<T>(
  tenantId: string,
  userId: string,
  operation: () => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL app.current_tenant_id = ${tenantId}`);
    await tx.execute(sql`SET LOCAL app.current_user_id = ${userId}`);
    return operation();
  });
}
```

### 6.3 RLS Testing

Every migration creating a tenant-scoped table **MUST** include tests verifying:
- Tenant A cannot read/modify Tenant B's data
- Super admin can access all tenants' data
- Queries without tenant context fail or return empty

---

## 7. Indexing Strategy

### 7.1 Mandatory Indexes

Every table **MUST** have:

```sql
CREATE INDEX idx_{table}_tenant  ON {table}(tenant_id);
CREATE INDEX idx_{table}_active  ON {table}(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_{table}_created ON {table}(created_at DESC);
```

### 7.2 Index Types Guide

| Use Case | Index Type |
|----------|------------|
| Equality lookups | B-Tree (default) |
| Range queries | B-Tree |
| JSONB containment | GIN |
| Full-text search | GIN + `to_tsvector` |
| Array containment | GIN |
| Low-cardinality / partial | Partial B-Tree |

### 7.3 Index Anti-Patterns

| ❌ Anti-Pattern | ✅ Correct Approach |
|-----------------|---------------------|
| Indexing every column | Index only query-critical columns |
| Composite indexes with > 4 columns | Break into multiple focused indexes |
| Ignoring `EXPLAIN ANALYZE` | Always verify index usage |
| Not monitoring unused indexes | Audit with `pg_stat_user_indexes` |

---

## 8. Constraints & Referential Integrity

### 8.1 Foreign Keys

```sql
-- ✅ Good — explicit FK with ON DELETE behavior
tenant_id UUID NOT NULL REFERENCES identity_tenants(id) ON DELETE RESTRICT
```

### 8.2 ON DELETE Behavior

| Behavior | Use Case |
|----------|----------|
| `RESTRICT` (default) | Prevent deletion if referenced (e.g., `tenant_id`) |
| `CASCADE` | Child records follow parent (e.g., `assessment_id` on submissions) |
| `SET NULL` | Orphan is acceptable (e.g., optional rubric) |

### 8.3 CHECK Constraints

```sql
ALTER TABLE assessment_assessments
  ADD CONSTRAINT assessment_status_check
  CHECK (status IN ('draft','review','approved','published','active','completed','archived'));

ALTER TABLE assessment_grades
  ADD CONSTRAINT grade_percentage_check
  CHECK (percentage >= 0 AND percentage <= 100);
```

---

## 9. JSONB Usage Guidelines

**✅ Use JSONB for:**
- Extensible metadata (`user.metadata`)
- Tenant-specific settings (`tenant.settings`)
- Configuration objects
- Feature flags

**❌ Do NOT use JSONB for:**
- Data that requires frequent querying/filtering
- Data that requires referential integrity
- Core business entities (use proper tables)

---

## 10. Soft Deletes & Audit Trails

### 10.1 Soft Delete

**NEVER use physical `DELETE` on business data.**

```sql
-- ✅ Good
UPDATE assessment_assessments
SET deleted_at = NOW(), updated_at = NOW()
WHERE id = $1;

-- All queries for active records
SELECT * FROM assessment_assessments WHERE deleted_at IS NULL;
```

### 10.2 Audit Log Table

```sql
CREATE TABLE audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL,
  table_name TEXT NOT NULL,
  record_id  UUID NOT NULL,
  action     TEXT NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET
);
```

### 10.3 Auto-Update `updated_at` Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 11. Migrations (Drizzle ORM)

### 11.1 Migration Workflow

1. Modify Drizzle schema files in `lib/db/src/schema/`
2. Run `pnpm --filter @workspace/db run generate` to create migration SQL
3. Manually review the generated SQL
4. Apply with `pnpm --filter @workspace/db run push` (dev) or migration script (prod)
5. Run integration tests to confirm

### 11.2 Migration Rules

- ✅ Every migration **MUST** be reversible
- ✅ Every migration **MUST** be idempotent
- ✅ Breaking changes **MUST** follow 2-step deployment: add new → migrate data → remove old
- ❌ Never manually edit generated migration files
- ❌ Never run migrations directly on production without review

### 11.3 Example: Drizzle Schema

```typescript
// lib/db/src/schema/assessments.ts
import { pgTable, uuid, text, timestamp, integer, pgEnum, jsonb, index } from 'drizzle-orm/pg-core';
import { isNull } from 'drizzle-orm';

export const assessmentStatusEnum = pgEnum('assessment_status', [
  'draft', 'review', 'approved', 'published', 'active', 'completed', 'archived'
]);

export const assessments = pgTable('assessment_assessments', {
  id:          uuid('id').primaryKey().defaultRandom(),
  tenantId:    uuid('tenant_id').notNull(),  // references tenants.id
  type:        text('type').notNull(),
  title:       text('title').notNull(),
  description: text('description'),
  status:      assessmentStatusEnum('status').notNull().default('draft'),
  maxAttempts: integer('max_attempts').notNull().default(1),
  metadata:    jsonb('metadata').default({}),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt:   timestamp('deleted_at', { withTimezone: true }),
  version:     integer('version').notNull().default(1),
}, (table) => ({
  tenantIdx:  index('idx_assessments_tenant').on(table.tenantId),
  statusIdx:  index('idx_assessments_status').on(table.status),
  activeIdx:  index('idx_assessments_active').on(table.id).where(isNull(table.deletedAt)),
  createdIdx: index('idx_assessments_created').on(table.createdAt),
}));
```

---

## 12. Performance Targets

| Query Type | Target (p95) |
|------------|--------------|
| Simple lookup by PK | < 10ms |
| Filtered query (indexed) | < 50ms |
| Aggregation query | < 200ms |
| Full-text search | < 100ms |
| Complex join (3+ tables) | < 500ms |

---

## 13. Security

### 13.1 Encryption

- **At Rest:** AES-256 (database-level encryption)
- **In Transit:** TLS 1.3 required (`sslmode=require`)
- **Column-Level:** Use `pgcrypto` for PII (email, phone, national ID)

### 13.2 PII Protection

Tables containing PII **MUST**:
- Enable column-level encryption for sensitive fields
- Implement data masking in non-production environments
- Log all access to PII fields
- Comply with right-to-erasure requirements

---

## 14. Database Design Checklist

Before merging any schema-related change, verify:

- [ ] Table name follows `{domain}_{entity_plural}` convention
- [ ] All mandatory columns present (`id`, `tenant_id`, `created_at`, `updated_at`, `deleted_at`, `version`)
- [ ] Primary key is UUID with `gen_random_uuid()`
- [ ] Foreign keys explicitly defined with appropriate `ON DELETE` behavior
- [ ] RLS enabled and policy created
- [ ] Mandatory indexes created (`tenant_id`, `created_at`, active partial)
- [ ] CHECK constraints enforce business invariants
- [ ] Migration is reversible and idempotent
- [ ] PII columns are encrypted
- [ ] Audit logging configured for sensitive tables

---

## 15. Anti-Patterns

| ❌ Anti-Pattern | ✅ Correct Approach |
|-----------------|---------------------|
| Using `SELECT *` | Explicitly list columns |
| Physical deletes | Use soft deletes |
| `VARCHAR(n)` | Use `TEXT` |
| `FLOAT` for money/grades | Use `NUMERIC(p,s)` |
| No FK constraints | Always define explicit FKs |
| Ignoring transactions | Use explicit transactions for multi-step operations |
| Storing files in DB | Use object storage, store reference in DB |
| Business logic in triggers | Keep logic in application layer |

---

## 16. Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-01-30 | Initial draft |
| 0.5.0 | 2026-04-05 | Added RLS and partitioning |
| 0.8.0 | 2026-06-10 | Added JSONB guidelines and monitoring |
| 1.0.0 | 2026-07-13 | Final release, aligned with Architecture Constitution |

---

**Document ID:** DB-001 | **Owner:** Database Team & Platform Architecture
