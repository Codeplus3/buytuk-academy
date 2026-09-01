// =============================================================================
// BuyTuk Academy - Drizzle Service
// =============================================================================

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

export interface DrizzleConfig {
  url: string;
  poolMin?: number;
  poolMax?: number;
  idleTimeout?: number;
  connectTimeout?: number;
  maxLifetime?: number;
}

export class DrizzleService {
  private client: postgres.Sql;
  private db: ReturnType<typeof drizzle>;
  private config: DrizzleConfig;

  constructor(config: DrizzleConfig) {
    this.config = {
      poolMin: 5,
      poolMax: 20,
      idleTimeout: 30,
      connectTimeout: 10,
      maxLifetime: 60 * 30,
      ...config,
    };

    this.client = postgres(this.config.url, {
      max: this.config.poolMax,
      min: this.config.poolMin,
      idle_timeout: this.config.idleTimeout,
      connect_timeout: this.config.connectTimeout,
      max_lifetime: this.config.maxLifetime,
      onnotice: (notice) => {
        if (process.env.NODE_ENV === "development") {
          console.debug("[DB Notice]", notice);
        }
      },
      onparameter: (key, value) => {
        if (process.env.NODE_ENV === "development") {
          console.debug("[DB Parameter]", key, value);
        }
      },
    });

    this.db = drizzle(this.client, { schema });
  }

  getDb() {
    return this.db;
  }

  getClient() {
    return this.client;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client`SELECT 1`;
      return true;
    } catch (error) {
      console.error("[DB Health Check Failed]", error);
      return false;
    }
  }

  async close(): Promise<void> {
    try {
      await this.client.end();
      console.info("[DB] Connection closed");
    } catch (error) {
      console.error("[DB] Error closing connection", error);
    }
  }
}

let drizzleServiceInstance: DrizzleService | null = null;

export function getDrizzleService(): DrizzleService {
  if (!drizzleServiceInstance) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    drizzleServiceInstance = new DrizzleService({
      url,
      poolMin: parseInt(process.env.DATABASE_POOL_MIN || "5"),
      poolMax: parseInt(process.env.DATABASE_POOL_MAX || "20"),
    });
  }

  return drizzleServiceInstance;
}

export function getDb() {
  return getDrizzleService().getDb();
}

export async function closeDatabase(): Promise<void> {
  if (drizzleServiceInstance) {
    await drizzleServiceInstance.close();
    drizzleServiceInstance = null;
  }
}