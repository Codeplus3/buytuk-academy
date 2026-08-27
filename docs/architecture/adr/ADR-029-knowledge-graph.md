
```markdown
# ADR-029: Knowledge Graph for Learning

**Status:** Accepted  
**Date:** 2026-07-13  
**Supersedes:** None

---

## Context

Traditional systems store content linearly. They don't understand relationships between concepts, making it hard to diagnose WHY a student struggles.

## Decision

**Selected Approach:** Implement Knowledge Graph to model concept relationships

### Graph Structure
```typescript
interface ConceptNode {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  
  relationships: {
    prerequisites: ConceptNode[];      // Must learn first
    relatedConcepts: ConceptNode[];    // Connected ideas
    applications: Application[];       // Real-world use
    misconceptions: Misconception[];   // Common errors
    masteryIndicators: Indicator[];    // How to measure
  };
}
```

### Example (Mathematics)
```
Addition (Grade 1)
   ├── prerequisite: Number Recognition
   ├── related: Counting
   ├── application: Shopping
   ├── misconception: Carrying errors
   └── mastery: Can add single digits

Multiplication (Grade 3)
   ├── prerequisite: Addition
   ├── related: Repeated Addition
   ├── application: Area calculation
   ├── misconception: Times table memorization
   └── mastery: Can multiply single digits
```

### Usage
1. **Diagnosis** - Why did student fail? (missing prerequisite)
2. **Remediation** - What to review? (prerequisite concepts)
3. **Path Planning** - What to teach next? (knowledge graph traversal)
4. **Visualization** - Show learning map to student/teacher

### Implementation
- Graph database (Neo4j) or relational with graph queries
- Concept extraction from curriculum
- Relationship mapping by curriculum experts
- AI-assisted relationship discovery
- Visualization tools

## Rationale

1. **Diagnosis** - Understand root causes of struggles
2. **Personalization** - Targeted remediation
3. **Visualization** - Clear learning paths
4. **Adaptive** - Enables adaptive learning
5. **Insight** - Deep understanding of learning

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Graph complexity | High | Start with core subjects, expand gradually |
| Maintenance burden | High | AI-assisted updates, expert validation |
| Performance | Medium | Graph optimization, caching |
| Accuracy | High | Expert review, continuous validation |

## Consequences

### Positive
- Better diagnosis
- Targeted remediation
- Clear learning paths
- Enables adaptive learning
- Deep insights

### Negative
- Implementation complexity
- Maintenance overhead
- Requires expert input
- Performance considerations

---

**End of ADR-029**
