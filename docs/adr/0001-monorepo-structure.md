# 1. Monorepo Structure
- **Status**: Accepted
- **Context**: Managing multiple packages and apps separately caused dependency hell.
- **Decision**: Use pnpm workspaces + Turborepo.
- **Consequences**: Faster builds, shared types, easier refactoring.