# Security Architecture

## 1. Authentication
- **JWT**: Short-lived access tokens (7 days) and refresh tokens (30 days).
- **Socket.IO Auth**: Token passed in handshake auth object.

## 2. Authorization (RBAC)
- Roles: `admin`, `principal`, `teacher`, `parent`, `student`.
- Permissions are checked via NestJS Guards (`RolesGuard`).

## 3. Data Security
- **Row Level Security (RLS)**: Implemented in PostgreSQL policies.
- **Encryption**: Audio files encrypted at rest using AES-256-GCM. Keys managed via `AUDIO_KEK`.
- **Secrets**: Managed via Kubernetes Secrets or external vaults in production.

## 4. Network
- **CORS**: Strictly configured for known frontend domains.
- **Rate Limiting**: Applied via `express-rate-limit` and Redis.