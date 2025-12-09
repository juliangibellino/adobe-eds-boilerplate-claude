Perform a comprehensive performance audit for this Adobe EDS project.

## Performance Targets

Adobe EDS projects should meet these goals:
- **Lighthouse Score:** 100/100/100/100 (Performance, Accessibility, Best Practices, SEO)
- **LCP (Largest Contentful Paint):** <1.5 seconds
- **CLS (Cumulative Layout Shift):** <0.1
- **FID (First Input Delay):** <100ms
- **TTI (Time to Interactive):** <3.5s
- **Eager Load Budget:** <100KB (critical CSS + JS)

## Audit Checklist

### 1. Bundle Size Analysis

Analyze the eager-loaded resources:

```bash
# Check critical CSS size
du -h styles/styles.css

# Check critical JS size
du -h scripts/scripts.js scripts/aem.js scripts/lib/*.js

# Total eager bundle (should be <100KB)
```

**Check:**
- [ ] Critical CSS <20KB
- [ ] Critical JS <80KB
- [ ] Total eager bundle <100KB
- [ ] Lazy-loaded resources moved out of critical path

**Report findings:**
- Current eager bundle size: ___KB
- Recommended optimizations: ___

---

### 2. Loading Strategy

Examine `scripts/scripts.js` for proper load phases:

**loadEager():**
- [ ] Only critical DOM decoration
- [ ] LCP block identified and prioritized
- [ ] No blocking operations

**loadLazy():**
- [ ] Block JS/CSS loaded lazily
- [ ] Header/footer loaded after LCP
- [ ] Non-critical fonts deferred

**loadDelayed():**
- [ ] Analytics loaded after 3+ seconds
- [ ] Third-party scripts deferred
- [ ] No render-blocking code

---

### 3. Image Optimization

Check all image usage in blocks:

**Required optimizations:**
- [ ] Images use EDS optimization params (`?width=X&format=webp`)
- [ ] Lazy loading on below-fold images (`loading="lazy"`)
- [ ] Eager loading only on LCP image
- [ ] Responsive images with `<picture>` or `srcset`
- [ ] Proper dimensions set (no layout shift)
- [ ] WebP format used
- [ ] Appropriate width parameters (not over-serving)

**Example correct usage:**
```javascript
`<img
  src="${src}?width=2000&format=webp"
  alt="${esc(alt)}"
  width="2000"
  height="1200"
  loading="lazy"
>`
```

**Report findings:**
- Images without optimization: ___
- Images missing lazy loading: ___
- Images causing layout shift: ___

---

### 4. CSS Performance

Audit CSS files for performance issues:

**Design Tokens:**
- [ ] All sizing uses `var(--space-*)` (no magic numbers)
- [ ] All colors use `var(--color-*)`
- [ ] All typography uses `var(--font-size-*)`, `var(--font-weight-*)`
- [ ] No duplicate styles

**Critical CSS:**
- [ ] `styles/styles.css` contains only critical/above-fold styles
- [ ] Design tokens defined once
- [ ] Base styles minimal
- [ ] Block-specific CSS in block files (not in global CSS)

**Lazy CSS:**
- [ ] Non-critical styles in `lazy-styles.css`
- [ ] Fonts loaded async in `fonts.css`
- [ ] Block CSS auto-loaded with block JS

**Anti-patterns to flag:**
```css
/* ❌ WRONG - Layout shift risk */
.block {
  min-height: auto; /* No height reserved */
}

/* ❌ WRONG - Expensive selector */
* + * { margin-top: 1rem; }

/* ❌ WRONG - Magic numbers */
.block { padding: 24px; }

/* ✅ CORRECT */
.block {
  min-height: 400px; /* Reserve space */
  padding: var(--space-6);
}
```

---

### 5. JavaScript Performance

Audit JS files for performance issues:

**Event Delegation:**
- [ ] Using centralized event delegation (not individual listeners)
- [ ] No memory leaks from unremoved listeners
- [ ] `on()` and `onActivate()` used in components

**State Management:**
- [ ] No unnecessary re-renders
- [ ] State updates batched where possible
- [ ] Expensive operations memoized/cached

**DOM Manipulation:**
- [ ] Minimal direct DOM access
- [ ] Batch DOM updates
- [ ] No layout thrashing (read/write cycles)

**Anti-patterns to flag:**
```javascript
// ❌ WRONG - Individual listeners
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handler);
});

// ❌ WRONG - Layout thrashing
elements.forEach(el => {
  const height = el.offsetHeight; // READ
  el.style.height = height + 10 + 'px'; // WRITE
});

// ❌ WRONG - Unnecessary re-renders
c.setState({ x: c.state.x }); // No change!

// ✅ CORRECT
c.on('click', '.btn', handler);
```

---

### 6. Third-Party Scripts

Audit external dependencies:

- [ ] List all third-party scripts
- [ ] Verify they're in `loadDelayed()` (3+ second delay)
- [ ] Check for render-blocking scripts
- [ ] Measure impact on performance

**Report:**
- Third-party scripts found: ___
- Load timing: ___
- Performance impact: ___

---

### 7. Font Loading

Check font loading strategy:

- [ ] Custom fonts loaded async (not blocking)
- [ ] System font fallbacks defined
- [ ] `font-display: swap` used
- [ ] FOUT (Flash of Unstyled Text) acceptable
- [ ] No FOIT (Flash of Invisible Text)

**In `styles/fonts.css`:**
```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* ✅ Prevents FOIT */
  font-weight: 400;
  font-style: normal;
}
```

---

### 8. LCP Optimization

Identify and optimize Largest Contentful Paint:

**Find LCP element:**
- [ ] Usually hero image or heading
- [ ] Declared in page metadata if needed
- [ ] Prioritized in load order

**Optimize LCP:**
- [ ] LCP image not lazy-loaded
- [ ] LCP image uses fetchpriority="high"
- [ ] LCP image dimensions set (no shift)
- [ ] No render-blocking resources before LCP
- [ ] Critical CSS includes LCP styles

**Example:**
```javascript
// In blocks/hero/hero.js
`<img
  src="${src}?width=2000&format=webp"
  alt="${esc(alt)}"
  width="2000"
  height="1200"
  fetchpriority="high"
  loading="eager"
>`
```

---

### 9. CLS Prevention

Check for Cumulative Layout Shift issues:

**Common causes:**
- [ ] Images without dimensions
- [ ] Fonts causing layout reflow
- [ ] Ads/embeds without reserved space
- [ ] Dynamic content injected above fold
- [ ] CSS animations affecting layout

**Solutions:**
- [ ] Set explicit width/height on images
- [ ] Use `aspect-ratio` CSS property
- [ ] Reserve space for dynamic content
- [ ] Use `transform` instead of layout properties

```css
/* ❌ WRONG - Causes CLS */
.block {
  margin-top: 20px; /* Changes during animation */
}

/* ✅ CORRECT - No CLS */
.block {
  transform: translateY(20px);
}
```

---

### 10. Debouncing & Throttling

Check for expensive operations that need optimization:

**Should be debounced/throttled:**
- [ ] Scroll handlers
- [ ] Resize handlers
- [ ] Input handlers (search, filters)
- [ ] API calls
- [ ] localStorage writes

**Example:**
```javascript
import { debounce } from '../../scripts/lib/index.js';

const handleSearch = debounce((query) => {
  // Expensive search operation
}, 300);

c.on('input', '.search', (e, el) => {
  handleSearch(el.value);
});
```

---

## Performance Testing Commands

Run these tests and report results:

### Lighthouse Audit
```bash
# Install lighthouse CLI
npm install -g lighthouse

# Run audit (requires aem up running)
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

### Bundle Analysis
```bash
# Check total eager bundle size
du -ch scripts/scripts.js scripts/aem.js scripts/lib/*.js styles/styles.css | tail -1
```

### Image Analysis
```bash
# Find unoptimized images
grep -r "src=" blocks/ | grep -v "width=" | grep -v "format=webp"
```

---

## Output Format

Provide your performance audit in this structure:

### Performance Summary
- Overall Score: ___/100
- LCP: ___s (Target: <1.5s)
- CLS: ___ (Target: <0.1)
- FID: ___ms (Target: <100ms)
- Eager Bundle: ___KB (Target: <100KB)

### Critical Issues (Performance Blockers)
- **[File:Line]** - [Issue description]
  - Current: [measurement]
  - Target: [target metric]
  - Fix: [specific recommendation]

### High Priority Optimizations
[List with specific file paths and line numbers]

### Medium Priority Optimizations
[List with specific file paths and line numbers]

### Low Priority / Future Optimizations
[Nice-to-have improvements]

### What's Performing Well
[Positive feedback on good practices]

### Estimated Impact
- Critical fixes: +___pts Lighthouse, -___s LCP
- High priority: +___pts Lighthouse
- Total potential: +___pts Lighthouse score

---

Now perform the performance audit.
