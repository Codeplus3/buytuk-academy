```markdown
# ADR-027: Offline-First Architecture

**Status:** Accepted  
**Date:** 2026-07-13  
**Supersedes:** None

---

## Context

Many target regions have unreliable internet connectivity. Students and teachers need to work offline and sync when connectivity is available.

## Decision

**Selected Approach:** Offline-first with background sync and conflict resolution

### Offline Capabilities
- Assessment taking
- Evidence upload (queued)
- Attendance marking
- Homework submission
- Content viewing (cached)
- Progress tracking

### Sync Strategy
- Local storage (IndexedDB/SQLite)
- Background Sync API
- Conflict resolution (timestamp-based, field-level)
- Audit trail for all syncs

### Implementation
- Service Workers for caching
- IndexedDB for local storage
- Sync queue with retry logic
- Conflict resolution UI

## Rationale

1. **Accessibility** - Works in low-connectivity areas
2. **Reliability** - No data loss during outages
3. **User Experience** - Seamless offline/online transition
4. **Market Reach** - Enables deployment in developing regions
5. **Competitive** - Most platforms require constant connectivity

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data conflicts | High | Robust conflict resolution, user choice |
| Storage limits | Medium | Quota management, cleanup policies |
| Sync delays | Medium | Progress indicators, manual sync option |
| Security (local data) | High | Encryption at rest, secure storage |
| Complexity | High | Phased rollout, comprehensive testing |

## Consequences

### Positive
- Works offline
- No data loss
- Better UX
- Wider market
- Competitive advantage

### Negative
- Implementation complexity
- Storage requirements
- Sync challenges
- Testing complexity

---

**End of ADR-027**
