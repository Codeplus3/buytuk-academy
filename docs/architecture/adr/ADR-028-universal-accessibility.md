```markdown
# ADR-028: Universal Accessibility

**Status:** Accepted  
**Date:** 2026-07-13  
**Supersedes:** None

---

## Context

The platform serves students with diverse abilities and learning differences. Accessibility is not optional—it's a core requirement.

## Decision

**Selected Approach:** WCAG 2.1 AAA compliance + specialized accessibility modes

### Accessibility Modes
1. **Dyslexia Mode** - Specialized fonts, spacing, colors
2. **Color Blind Mode** - Alternative color palettes
3. **Low Vision Mode** - Large fonts, high contrast, zoom
4. **ADHD Mode** - Reduced distractions, focus mode
5. **Keyboard Only** - Full keyboard navigation
6. **Voice Navigation** - Voice commands
7. **Screen Reader** - ARIA labels, semantic HTML
8. **Sign Language** - Video support
9. **Hearing Impairment** - Captions, visual alerts

### Implementation
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast (7:1 minimum)
- Text alternatives
- Captions and transcripts
- Responsive design
- Reduced motion support

### Testing
- Automated (axe-core, Lighthouse)
- Manual (screen readers, keyboard-only)
- User testing (disabled users)
- Regular audits

## Rationale

1. **Legal** - Compliance with accessibility laws
2. **Ethical** - Equal access for all students
3. **Market** - Larger addressable market
4. **Quality** - Better UX for everyone
5. **Alignment** - Matches platform's therapeutic mission

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Implementation cost | High | Incremental implementation, prioritization |
| Performance impact | Medium | Optimization, lazy loading |
| Design constraints | Medium | Design system with accessibility built-in |
| Testing complexity | High | Automated + manual testing, user testing |

## Consequences

### Positive
- Universal access
- Legal compliance
- Better UX
- Larger market
- Ethical alignment

### Negative
- Implementation cost
- Design constraints
- Testing overhead
- Performance considerations

---

**End of ADR-028**
