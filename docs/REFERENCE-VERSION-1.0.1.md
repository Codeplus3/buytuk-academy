# BuyTuk Academy Reference Version 1.0.1

**Date:** 2026-09-02

This document records the reference implementation saved in the repository after the six requested stages.

## Included Changes

- Authentication validates users from the database with bcrypt and rejects inactive accounts.
- JWT configuration requires an explicit `JWT_SECRET` and supports `JWT_EXPIRES_IN`.
- All API routes require JWT by default; only routes explicitly marked `@Public()` are unauthenticated.
- BullMQ workers are registered for analyze, realtime, notification, email, cleanup, and scheduled queues.
- Worker failures are sent to the dead-letter queue after retry exhaustion.
- React, Next.js, and React type packages are aligned for the web application.
- The missing web `globals.css` entry point was added.
- Student, teacher, and admin attendance views were added under `apps/web/app/attendance`.
- Attendance reads and writes use the PostgreSQL-backed API, with a non-persistent demo fallback when no access token exists.
- The gRPC inference gateway now registers Whisper, Alignment, G2P, and Feedback services.
- Gateway proxies use worker routing, timeouts, and circuit-breaker handling.
- ML worker RPC handlers and protobuf generation during Docker build were added.
- WhisperX alignment is used for real word-level alignment instead of equal-time placeholders.
- API, Worker, and Gateway test coverage was added.
- `pnpm-lock.yaml` was generated for reproducible dependency resolution.

## Verification

- TypeScript editor diagnostics passed for changed authentication, worker, web, and attendance API files.
- Python syntax validation passed for changed gateway and ML worker files.
- JSON configuration validation passed for web configuration.
- Full build and runtime tests remain pending because dependency installation was interrupted by npm registry connectivity and Docker/kubectl are unavailable in the current environment.

## Required Runtime Setup

1. Install Node.js 20+, pnpm 9+, and the workspace dependencies.
2. Configure `JWT_SECRET`, `DATABASE_URL`, and `REDIS_URL`.
3. Obtain a JWT from the API and store it as `buytuk_access_token` for the attendance web pages.
4. Ensure the PostgreSQL attendance schema is migrated before enabling attendance writes.
5. Install the Python inference requirements and build the gateway image to generate protobuf files.
6. For Kubernetes, provision the `buytuk-inference-tls` Secret with `tls.crt` and `tls.key` before applying `k8s/inference-deployment.yaml` and `k8s/inference-workers.yaml`.