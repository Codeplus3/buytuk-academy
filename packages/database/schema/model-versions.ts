// =============================================================================
// BuyTuk Academy - Model Versions Schema
// =============================================================================

import {
  pgTable,
  serial,
  text,
  jsonb,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const modelVersions = pgTable(
  "model_versions",
  {
    id: serial("id").primaryKey(),
    modelName: text("model_name").notNull(),
    version: text("version").notNull(),
    sha256: text("sha256"),
    endpoint: text("endpoint"),
    parameters: jsonb("parameters"),
    deployedAt: timestamp("deployed_at").defaultNow(),
    retiredAt: timestamp("retired_at"),
    isActive: boolean("is_active").default(true),
  },
  (table) => ({
    modelNameIdx: index("model_versions_name_idx").on(table.modelName),
    activeIdx: index("model_versions_active_idx").on(table.isActive),
    versionIdx: index("model_versions_version_idx").on(table.version),
  })
);

export type ModelVersion = typeof modelVersions.$inferSelect;
export type NewModelVersion = typeof modelVersions.$inferInsert;