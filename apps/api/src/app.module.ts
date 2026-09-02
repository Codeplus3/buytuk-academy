// =============================================================================
// BuyTuk Academy - API Root Module
// =============================================================================

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { GlobalJwtGuard } from './auth/guards/global-jwt.guard.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TerminusModule,
    AuthModule,
    AttendanceModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: GlobalJwtGuard }],
})
export class AppModule {}
