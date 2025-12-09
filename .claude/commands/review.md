You are performing a comprehensive code review for an Adobe Edge Delivery Services (EDS) project.

## Review Focus Areas

Review the code changes against these critical criteria:

### 1. Architecture & Patterns
- [ ] Follows block-first architecture (stateless vs stateful pattern)
- [ ] Uses framework atoms from `/scripts/lib/` instead of raw HTML
- [ ] Proper component lifecycle (setup, mounted, render, destroy)
- [ ] Event delegation pattern used (no individual listeners)
- [ ] State management follows immutability patterns
- [ ] Store subscriptions properly managed

### 2. Security
- [ ] **CRITICAL:** All user content escaped with `esc()` utility
- [ ] No XSS vulnerabilities (check template literals with dynamic content)
- [ ] `richText()` only used for trusted EDS content, never user input
- [ ] No inline event handlers (`onclick=""`)
- [ ] No `eval()` or `Function()` constructors
- [ ] No SQL injection risks (if applicable)

### 3. Performance
- [ ] Eager load budget maintained (<100KB for critical path)
- [ ] Non-critical CSS/fonts lazy-loaded
- [ ] Images use EDS optimization params (`?width=X&format=webp`)
- [ ] Images have `loading="lazy"` where appropriate
- [ ] Expensive operations debounced/throttled
- [ ] No unnecessary re-renders (state updates optimized)
- [ ] Event delegation used (no per-element listeners)

### 4. CSS & Styling
- [ ] Design tokens used (no magic numbers like `16px`, `#333`)
- [ ] Variables from `/styles/styles.css` used:
  - Colors: `var(--color-*)`
  - Spacing: `var(--space-*)`
  - Typography: `var(--font-size-*)`, `var(--font-weight-*)`
  - Radius: `var(--radius-*)`
- [ ] BEM-like naming convention followed
- [ ] Mobile-first responsive approach
- [ ] No `!important` unless absolutely necessary

### 5. Accessibility
- [ ] Semantic HTML used (not `<div>` soup)
- [ ] Interactive elements keyboard accessible
- [ ] `onActivate()` used for click + keyboard handling
- [ ] ARIA labels on icon buttons and non-text elements
- [ ] Focus states styled (`:focus-visible`)
- [ ] Color contrast meets WCAG AA standards
- [ ] Reduced motion support (`@media (prefers-reduced-motion)`)

### 6. Code Quality
- [ ] Imports from unified `/scripts/lib/index.js`
- [ ] No ESLint errors
- [ ] Consistent naming conventions (kebab-case for files/blocks)
- [ ] No console.log statements in production code
- [ ] Error handling present where needed
- [ ] No duplicate code (DRY principle)

### 7. EDS Best Practices
- [ ] Block structure follows convention (`/blocks/[name]/[name].js` + `.css`)
- [ ] `decorate(block)` function exported as default
- [ ] Block CSS scoped to block class name
- [ ] No breaking changes to EDS-generated DOM structure
- [ ] LCP block declared if applicable

## Anti-Patterns to Flag

### Critical Issues (Must Fix)
- ❌ Unescaped user content (XSS vulnerability)
- ❌ Memory leaks (event listeners not cleaned up)
- ❌ Direct state mutation (`c.state.x = y`)
- ❌ Individual event listeners instead of delegation
- ❌ Inline scripts or CSP violations

### Code Smells (Should Fix)
- ⚠️ Magic numbers instead of design tokens
- ⚠️ Raw HTML strings instead of atoms
- ⚠️ Missing ARIA labels on interactive elements
- ⚠️ No keyboard support for clickable elements
- ⚠️ Hardcoded colors/sizes instead of CSS variables
- ⚠️ Missing focus states

### Optimization Opportunities (Nice to Have)
- 💡 Can this be lazy-loaded?
- 💡 Can this be memoized/cached?
- 💡 Can state updates be batched?
- 💡 Can this use a more semantic HTML element?

## Review Process

1. **Examine the code changes** - Read through all modified files
2. **Check each focus area** - Go through the checklist systematically
3. **Identify issues** - Flag critical issues, code smells, and opportunities
4. **Provide specific feedback** - Include file paths and line numbers
5. **Suggest fixes** - Provide concrete code examples for improvements
6. **Assess severity** - Rate findings as Critical, High, Medium, or Low

## Output Format

Provide your review in this structure:

### Summary
[Brief overview of changes and overall code quality]

### Critical Issues (Must Fix Before Merge)
- **[File:Line]** - [Issue description]
  ```javascript
  // Current (wrong)
  [problematic code]

  // Fixed
  [corrected code]
  ```

### High Priority Issues
[Similar format]

### Medium Priority Issues
[Similar format]

### Suggestions & Improvements
[Similar format]

### What Went Well
- [Positive feedback on good practices]

### Performance Impact
[Estimate impact on bundle size, LCP, etc.]

### Accessibility Score
[Rate A11y compliance: Excellent / Good / Needs Work / Poor]

### Security Score
[Rate security: Secure / Minor Issues / Vulnerable]

---

Now review the code.
