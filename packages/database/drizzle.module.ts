// =============================================================================
// BuyTuk Academy - Drizzle Module (NestJS)
// =============================================================================

import { Module, Global, OnModuleDestroy } from "@nestjs/common";
import { DrizzleService, getDrizzleService, closeDatabase } from "./drizzle.service.js";

@Global()
@Module({
  providers: [
    {
      provide: "DRIZZLE_SERVICE",
      useFactory: () => {
        return getDrizzleService();
      },
    },
    {
      provide: "DRIZZLE_DB",
      useFactory: () => {
        return getDrizzleService().getDb();
      },
    },
  ],
  exports: ["DRIZZLE_SERVICE", "DRIZZLE_DB"],
})
export class DrizzleModule implements OnModuleDestroy {
  async onModuleDestroy() {
    await closeDatabase();
  }
}