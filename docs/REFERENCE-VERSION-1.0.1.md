# BuyTuk Academy Reference Version 1.0.1

**Date:** 2026-09-02

This document records the reference implementation saved in the repository after the six requested stages.

## Included Changes

- Authentication validates users from the database with bcrypt and rejects inactive accounts.
- JWT configuration requires an explicit `JWT_SECRET` and supports `JWT_EXPIRES_IN`.
- BullMQ workers are registered for analyze, realtime, notification, email, cleanup, and scheduled queues.
- Worker failures are sent to the dead-letter queue after retry exhaustion.
- React, Next.js, and React type packages are aligned for the web application.
- The missing web `globals.css` entry point was added.
- Student, teacher, and admin attendance views were added under `apps/web/app/attendance`.
- Attendance reads and writes use Firebase Firestore when configured, with a non-persistent demo fallback.
- Firebase requires a signed-in non-anonymous user for persistent attendance, with ownership rules in `firestore.rules`.
- The gRPC inference gateway now registers Whisper, Alignment, G2P, and Feedback services.
- Gateway proxies use worker routing, timeouts, and circuit-breaker handling.
- ML worker RPC handlers and protobuf generation during Docker build were added.

## Verification

- TypeScript editor diagnostics passed for changed authentication, worker, web, and Firebase files.
- Python syntax validation passed for gateway and ML worker files.
- JSON configuration validation passed for web and Firebase-related configuration.
- Full Node, pnpm, gRPC, Docker, and Firebase runtime tests remain pending because the required local dependencies and service credentials are not installed in the current environment.

## Required Runtime Setup

1. Install Node.js 20+, pnpm 9+, and the workspace dependencies.
2. Configure `JWT_SECRET`, `DATABASE_URL`, and `REDIS_URL`.
3. Fill the `NEXT_PUBLIC_FIREBASE_*` variables in `.env`.
4. Configure a real Firebase sign-in provider, create the required `userProfiles` role records, and deploy `firestore.rules`.
5. Install the Python inference requirements and build the gateway image to generate protobuf files.
6. For Kubernetes, provision the `buytuk-inference-tls` Secret with `tls.crt` and `tls.key` before applying `k8s/inference-deployment.yaml` and `k8s/inference-workers.yaml`.