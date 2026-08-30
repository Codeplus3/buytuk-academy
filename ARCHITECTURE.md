# BuyTuk Academy Architecture

## Overview

BuyTuk Academy is a monorepo educational platform built with TypeScript, using a microservices architecture with specialized engines for different educational domains.

## Technology Stack

- **Runtime:** Node.js 20+
- **Package Manager:** pnpm
- **Language:** TypeScript
- **Backend:** NestJS (apps/api)
- **Frontend:** Next.js (apps/web)
- **Workers:** BullMQ (apps/worker)
- **Database:** PostgreSQL with Drizzle ORM
- **Cache:** Redis
- **Message Queue:** BullMQ with Redis
- **ML/Inference:** Python workers (inference-gateway)

## Project Structure

```
buytuk-academy/
├── apps/                    # Main applications
│   ├── api/                # NestJS backend
│   ├── web/                # Next.js frontend
│   └── worker/             # BullMQ workers
├── engines/                # Specialized educational engines
│   ├── reading-engine/     # Reading assessment
│   ├── assessment-engine/  # General assessment
│   ├── content-engine/     # Content generation
│   ├── lesson-engine/      # Lesson management
│   ├── dictation-engine/   # Dictation exercises
│   └── learning-diagnosis/ # Learning gap detection
├── domains/                # Educational domains
│   ├── english/            # English learning
│   ├── arabic/             # Arabic learning
│   ├── math/               # Mathematics
│   └── science/            # Science subjects
├── packages/               # Shared packages
│   ├── ui/                 # UI components
│   ├── contracts/          # Shared types
│   ├── config/             # Configuration
│   ├── shared/             # Utilities
│   ├── queue/              # Queue setup
│   ├── database/           # Database schema
│   ├── security/           # Security layer
│   ├── observability/      # Logging & metrics
│   ├── exercises-catalog/  # Exercise data
│   ├── curriculum/         # Curriculum data
│   └── i18n/               # Internationalization
├── inference-gateway/       # Python ML workers
├── docker/                 # Docker configurations
├── k8s/                    # Kubernetes manifests
└── scripts/                # Development scripts
```

## Core Services

### API Service (apps/api)
- Authentication & Authorization
- User Management
- Student Management
- Teacher Management
- Class Management
- Lesson Management
- Assessment Management
- Reporting & Analytics

### Web Application (apps/web)
- Student Portal
- Teacher Portal
- Parent Portal
- Principal Portal
- Admin Portal
- English Learning Interface

### Worker Service (apps/worker)
- Reading Analysis
- Lesson Processing
- Content Generation
- Notification Processing
- Analytics Aggregation
- Report Generation

## Educational Engines

### Reading Engine
- Audio enhancement
- Feature extraction
- Voice Activity Detection
- Speech-to-Text
- Forced Alignment
- Grapheme-to-Phoneme
- Phonetic Analysis
- Scoring & Feedback

### Assessment Engine
- Score calculation
- Grade calculation
- Percentile calculation
- Formative assessment
- Summative assessment
- Diagnostic assessment
- Rubric management

### Content Engine
- Content generation
- Question generation
- Exercise generation
- Content management
- Version control
- Adaptive content delivery

### Lesson Engine
- Lesson planning
- Objective mapping
- Activity sequencing
- Lesson delivery
- Timeline management
- Pacing control

### Dictation Engine
- Dictation sessions
- Word presentation
- Response evaluation
- Error detection
- Correction suggestions
- Feedback generation

### Learning Diagnosis Engine
- Learning gap detection
- Misconception detection
- Skill mastery analysis
- Intervention planning
- Remediation strategies
- Cognitive profiling

## Data Flow

1. **User Interaction** → Web App
2. **API Request** → API Service
3. **Background Processing** → Worker Service
4. **ML Processing** → Inference Gateway
5. **Data Storage** → PostgreSQL
6. **Caching** → Redis
7. **Queue Management** → BullMQ

## Security

- JWT Authentication
- Role-Based Access Control (RBAC)
- Row-Level Security (RLS)
- API Key Management
- Signed URLs
- Encryption at rest
- TLS 1.3 in transit

## Observability

- Structured Logging
- Metrics Collection
- Distributed Tracing
- Health Checks
- Error Tracking
- Performance Monitoring

## Deployment

- **Development:** Docker Compose
- **Staging:** Kubernetes
- **Production:** Kubernetes with HPA

## Development Guidelines

- Use TypeScript strict mode
- Follow conventional commits
- Write tests for all features
- Document public APIs
- Use shared packages for common functionality
- Keep engines independent and reusable
