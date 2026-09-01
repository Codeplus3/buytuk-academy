// =============================================================================
// BuyTuk Academy - Curriculum Schema
// =============================================================================

import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const curriculumStandards = pgTable(
  "curriculum_standards",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull(),
    description: text("description").notNull(),
    domain: text("domain").notNull(), // arabic, english, math, science
    grade: text("grade").notNull(),
    strand: text("strand").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    codeIdx: index("curriculum_standards_code_idx").on(table.code),
    domainIdx: index("curriculum_standards_domain_idx").on(table.domain),
  })
);

export const learningObjectives = pgTable(
  "learning_objectives",
  {
    id: serial("id").primaryKey(),
    standardId: integer("standard_id")
      .references(() => curriculumStandards.id, { onDelete: "cascade" })
      .notNull(),
    description: text("description").notNull(),
    cognitiveLevel: text("cognitive_level").notNull(), // remember, understand, apply, analyze, evaluate, create
    measurable: text("measurable").default("true"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    standardIdx: index("learning_objectives_standard_idx").on(table.standardId),
  })
);

export const scopeSequence = pgTable("scope_sequence", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  grade: text("grade").notNull(),
  unit: text("unit").notNull(),
  objectives: jsonb("objectives").notNull(),
  estimatedWeeks: integer("estimated_weeks").notNull(),
  prerequisites: jsonb("prerequisites"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const curriculumMapping = pgTable("curriculum_mapping", {
  id: serial("id").primaryKey(),
  objectiveId: integer("objective_id")
    .references(() => learningObjectives.id, { onDelete: "cascade" })
    .notNull(),
  contentId: integer("content_id").notNull(),
  contentType: text("content_type").notNull(),
  alignmentStrength: text("alignment_strength").notNull(), // strong, moderate, weak
  createdAt: timestamp("created_at").defaultNow(),
});

export type CurriculumStandard = typeof curriculumStandards.$inferSelect;
export type LearningObjective = typeof learningObjectives.$inferSelect;
export type ScopeSequence = typeof scopeSequence.$inferSelect;
export type CurriculumMapping = typeof curriculumMapping.$inferSelect;