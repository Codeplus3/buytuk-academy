# BuyTuk Academy - Architecture Overview

## 1. High-Level Design
BuyTuk Academy is built on a **Monorepo Architecture** using `pnpm` workspaces and `Turborepo`. It follows **Domain-Driven Design (DDD)** principles to separate core business logic from infrastructure.

## 2. Key Components
- **Apps**: Deployable units (`api` using NestJS, `web` using Next.js, `worker` for background jobs).
- **Engines**: Specialized ML and business logic modules (Reading, Assessment, Content, etc.).
- **Domains**: Subject-specific logic (Arabic, English, Math, Science).
- **Packages**: Shared libraries (UI, Contracts, Database, Security).
- **Inference Gateway**: Python-based gRPC server for ML model serving.

## 3. Data Flow
1. **Client (Next.js)** sends audio via WebSocket to **API (NestJS)**.
2. **API** stores metadata in **PostgreSQL** and uploads audio to **S3**.
3. **API** enqueues a job to **Redis (BullMQ)**.
4. **Worker** picks up the job and calls **Inference Gateway** via gRPC.
5. **Inference Gateway** routes to specialized workers (Whisper, Alignment, G2P).
6. Results are processed by **Engines** (Scoring, Mastery) and saved to DB.
7. **WebSocket** notifies the client when the report is ready.