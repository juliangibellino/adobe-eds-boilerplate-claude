# Performance Audit Skill

## Overview

This skill performs comprehensive performance audits for the Behr EDS project, analyzing Core Web Vitals, bundle sizes, loading strategies, and optimization opportunities.

## Performance Targets

| Metric | Target | Description |
|--------|--------|-------------|
| Lighthouse Performance | 100 | Overall performance score |
| LCP | <1.5s | Largest Contentful Paint |
| CLS | <0.1 | Cumulative Layout Shift |
| FID | <100ms | First Input Delay |
| Eager Bundle | <100KB | Critical CSS + JS combined |

## Audit Checklist

### 1. Bundle Size Analysis

```bash
# Check sizes
du -h styles/styles.css scripts/scripts.js scripts/aem.js scripts/lib/*.js
```

**Targets:**
- [ ] Critical CSS: <20KB
- [ ] Critical JS: <80KB
- [ ] Total eager: <100KB

### 2. Image Optimization

- [ ] Use `?width=X&format=webp`
- [ ] `loading="lazy"` on below-fold images
- [ ] `loading="eager"` + `fetchpriority="high"` on LCP image
- [ ] Width/height attributes set

### 3. JavaScript Performance

- [ ] Event delegation via `c.on()`
- [ ] No per-element listeners
- [ ] State updates check for changes
- [ ] Expensive ops debounced

### 4. CSS Performance

- [ ] Design tokens used (no magic numbers)
- [ ] No duplicate styles
- [ ] Critical CSS minimal

### 5. Loading Strategy

- [ ] LCP block prioritized in loadEager()
- [ ] Non-critical resources in loadLazy()
- [ ] Third-party scripts in loadDelayed()

## Quick Commands

```bash
# Lighthouse audit
npx lighthouse http://localhost:3000 --output html

# Bundle size
du -ch styles/styles.css scripts/*.js | tail -1

# Find unoptimized images
grep -r "src=" blocks/ --include="*.js" | grep -v "format=webp"
```

## Output Format

```markdown
## Performance Summary
- Lighthouse: __/100
- LCP: __s (target <1.5s)
- Bundle: __KB (target <100KB)

### Issues Found
1. [Issue] - [Fix]

### Recommendations
- [Optimization opportunity]
```
