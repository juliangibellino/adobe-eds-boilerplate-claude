# Testing Blocks Skill

## Overview

This skill provides validation procedures for AEM Edge Delivery blocks before submitting pull requests. It covers visual testing, accessibility compliance, performance checks, and code quality verification.

## When to Use

Use this skill:
- After implementing a new block
- After modifying an existing block
- Before submitting a pull request
- When debugging block issues

## Prerequisites

- Block implementation complete
- Test content available at accessible URL
- Local development server running (`aem up`)

## Testing Phases

### Phase 1: Visual Testing

**1.1 Basic Rendering**

```bash
# Start local server
aem up
```

Navigate to test content URL and verify:
- [ ] Block renders without errors
- [ ] Content displays correctly
- [ ] Images load properly
- [ ] Links work as expected

**1.2 Responsive Testing**

Test at these breakpoints:
- [ ] Mobile: 375px (iPhone SE)
- [ ] Mobile large: 428px (iPhone 14 Pro Max)
- [ ] Tablet: 768px (iPad)
- [ ] Desktop: 1024px
- [ ] Large desktop: 1440px

Use browser DevTools device mode or resize window.

**1.3 Content Variations**

Test with different content:
- [ ] Minimal content (only required fields)
- [ ] Maximum content (all fields, long text)
- [ ] Empty/missing content (graceful fallback)
- [ ] Edge cases (special characters, very long words)

### Phase 2: Accessibility Testing

**2.1 Keyboard Navigation**

Test WITHOUT mouse:
- [ ] Tab through all interactive elements
- [ ] Tab order is logical
- [ ] Focus indicators visible on all focusable elements
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals/dropdowns
- [ ] No keyboard traps

**2.2 Screen Reader Testing**

Use VoiceOver (Mac) or NVDA (Windows):
- [ ] All content announced correctly
- [ ] Images have meaningful alt text
- [ ] Buttons/links announce their purpose
- [ ] Form fields have labels
- [ ] Dynamic content changes announced (aria-live)

**2.3 Visual Accessibility**

- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Text readable at 200% zoom
- [ ] Content visible in high contrast mode
- [ ] Not relying solely on color to convey information

**2.4 Accessibility Checklist**

```javascript
// Check for common issues in code:

// ARIA labels on icon buttons
button('', { icon: 'close', ariaLabel: 'Close dialog' })

// Keyboard support via onActivate
c.onActivate('.clickable', handler)  // Not just c.on('click')

// Semantic HTML
// Use <button>, <a>, <nav>, <main>, <header> etc.
```

### Phase 3: Performance Testing

**3.1 Lighthouse Audit**

```bash
# Run Lighthouse (requires server running)
npx lighthouse http://localhost:3000/test-page --output html --output-path ./lighthouse-report.html
```

Target scores:
- [ ] Performance: >95
- [ ] Accessibility: 100
- [ ] Best Practices: 100
- [ ] SEO: >95

**3.2 Core Web Vitals**

Check in Chrome DevTools > Performance:
- [ ] LCP (Largest Contentful Paint): <2.5s
- [ ] FID (First Input Delay): <100ms
- [ ] CLS (Cumulative Layout Shift): <0.1

**3.3 Bundle Impact**

```bash
# Check CSS size
du -h blocks/{block-name}/{block-name}.css

# Check JS size
du -h blocks/{block-name}/{block-name}.js
```

- [ ] Block CSS < 5KB
- [ ] Block JS < 10KB (unless complex component)
- [ ] No large dependencies added

**3.4 Image Optimization**

```bash
# Find images in block
grep -r "img\|src=" blocks/{block-name}/
```

- [ ] Images use `loading="lazy"` (except LCP)
- [ ] Images have `width` and `height` attributes
- [ ] Images use optimization params (`?width=X&format=webp`)

### Phase 4: Code Quality

**4.1 Linting**

```bash
npm run lint
```

- [ ] No ESLint errors
- [ ] No Stylelint errors

**4.2 Code Review Checklist**

**JavaScript:**
- [ ] Imports from `/scripts/lib/index.js`
- [ ] Uses atoms (not raw HTML strings)
- [ ] All dynamic content escaped with `esc()`
- [ ] Event delegation via `c.on()` / `c.onActivate()`
- [ ] State updates via `setState()` (never mutate directly)
- [ ] No `console.log` statements
- [ ] Proper error handling

**CSS:**
- [ ] Uses design tokens (no magic numbers)
- [ ] BEM-like naming convention
- [ ] Mobile-first responsive
- [ ] Focus states styled
- [ ] Reduced motion support

**Security:**
- [ ] No XSS vulnerabilities (check template literals)
- [ ] `richText()` only for trusted EDS content
- [ ] No inline event handlers

### Phase 5: Cross-Browser Testing

Test in major browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

Mobile browsers:
- [ ] iOS Safari
- [ ] Chrome Android

### Phase 6: Integration Testing

**6.1 Block Interactions**

If block interacts with other blocks or stores:
- [ ] Store updates propagate correctly
- [ ] Events fire as expected
- [ ] No conflicts with other blocks

**6.2 Page Context**

- [ ] Block works in different page sections
- [ ] Multiple instances on same page work
- [ ] Block handles missing dependencies gracefully

## Test Report Template

```markdown
## Block Test Report: {block-name}

**Date:** YYYY-MM-DD
**Tester:**
**Test Content URL:**

### Visual Testing
- [ ] Basic rendering: PASS / FAIL
- [ ] Responsive: PASS / FAIL
- [ ] Content variations: PASS / FAIL

### Accessibility
- [ ] Keyboard navigation: PASS / FAIL
- [ ] Screen reader: PASS / FAIL
- [ ] Color contrast: PASS / FAIL

### Performance
- [ ] Lighthouse Performance: __/100
- [ ] Lighthouse Accessibility: __/100
- [ ] LCP: __.__ s
- [ ] CLS: __.__

### Code Quality
- [ ] Lint: PASS / FAIL
- [ ] Code review: PASS / FAIL

### Issues Found
1. [Issue description] - [Severity: Critical/High/Medium/Low]

### Recommendation
[ ] Ready for PR
[ ] Needs fixes (see issues above)
```

## Quick Test Commands

```bash
# Run all checks
npm run lint && npm test

# Start local server
aem up

# Lighthouse audit
npx lighthouse http://localhost:3000/path --view

# Check accessibility (requires axe-cli)
npx @axe-core/cli http://localhost:3000/path
```

## Common Issues and Fixes

| Issue | Fix |
|-------|-----|
| Focus not visible | Add `:focus-visible` styles |
| Keyboard can't reach element | Use `onActivate()` or proper HTML elements |
| Layout shift on load | Add explicit dimensions to images |
| Contrast too low | Use design token colors |
| Mobile text too small | Use `--font-size-*` tokens |
