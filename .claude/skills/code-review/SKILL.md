# Code Review Skill

## Overview

This skill performs comprehensive code reviews for the Behr EDS project, focusing on architecture compliance, security vulnerabilities, performance optimization, and accessibility.

## When to Use

Use this skill:
- Before committing code
- During pull request reviews
- After completing a feature
- When refactoring code
- To learn best practices by example

## Review Focus Areas

### 1. Architecture & Patterns

Check for proper use of project architecture:

- [ ] Follows block-first architecture (stateless vs stateful pattern)
- [ ] Uses framework atoms from `/scripts/lib/` instead of raw HTML
- [ ] Proper component lifecycle (setup, mounted, render, destroy)
- [ ] Event delegation pattern used (no individual listeners)
- [ ] State management follows immutability patterns
- [ ] Store subscriptions properly managed with `c.subscribe()`

### 2. Security (CRITICAL)

Check for vulnerabilities:

- [ ] **All user content escaped with `esc()` utility**
- [ ] No XSS vulnerabilities in template literals
- [ ] `richText()` only used for trusted EDS content
- [ ] No inline event handlers (`onclick=""`)
- [ ] No `eval()` or `Function()` constructors
- [ ] No secrets/keys in code

**XSS Check Pattern:**
```bash
# Find potentially unescaped content
grep -r '\${[^}]*}' blocks/ --include="*.js" | grep -v 'esc('
```

### 3. Performance

Check for performance issues:

- [ ] Eager load budget maintained (<100KB critical path)
- [ ] Non-critical CSS/fonts lazy-loaded
- [ ] Images use EDS optimization params (`?width=X&format=webp`)
- [ ] Images have `loading="lazy"` where appropriate
- [ ] Expensive operations debounced/throttled
- [ ] No unnecessary re-renders
- [ ] Event delegation used (no per-element listeners)

### 4. CSS & Styling

Check for styling best practices:

- [ ] Design tokens used (no magic numbers like `16px`, `#333`)
- [ ] CSS variables from `/styles/styles.css`:
  - Colors: `var(--color-*)`
  - Spacing: `var(--space-*)`
  - Typography: `var(--font-size-*)`, `var(--font-weight-*)`
  - Radius: `var(--radius-*)`
- [ ] BEM-like naming convention
- [ ] Mobile-first responsive approach
- [ ] No `!important` unless absolutely necessary

### 5. Accessibility

Check for a11y compliance:

- [ ] Semantic HTML used (not `<div>` soup)
- [ ] Interactive elements keyboard accessible
- [ ] `onActivate()` used for click + keyboard handling
- [ ] ARIA labels on icon buttons and non-text elements
- [ ] Focus states styled (`:focus-visible`)
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion support (`@media (prefers-reduced-motion)`)

### 6. Code Quality

Check for clean code:

- [ ] Imports from unified `/scripts/lib/index.js`
- [ ] No ESLint errors
- [ ] Consistent naming (kebab-case for files/blocks)
- [ ] No console.log statements in production
- [ ] Error handling present where needed
- [ ] No duplicate code (DRY principle)
- [ ] JSDoc comments on functions

### 7. EDS Best Practices

Check for EDS compliance:

- [ ] Block structure follows convention (`/blocks/[name]/[name].js` + `.css`)
- [ ] `decorate(block)` function exported as default
- [ ] Block CSS scoped to block class name
- [ ] No breaking changes to EDS-generated DOM structure

## Anti-Patterns to Flag

### Critical Issues (Must Fix)

| Pattern | Problem | Fix |
|---------|---------|-----|
| `${userInput}` | XSS vulnerability | `${esc(userInput)}` |
| `c.state.x = y` | Direct mutation | `c.setState({ x: y })` |
| `el.addEventListener()` | Memory leak | `c.on('event', '.selector', handler)` |
| `onclick="..."` | CSP violation | Use event delegation |

### Code Smells (Should Fix)

| Pattern | Problem | Fix |
|---------|---------|-----|
| `padding: 16px` | Magic number | `padding: var(--space-4)` |
| `<div class="title">` | Non-semantic | `h1(title)` or `<h1>` |
| `c.on('click', ...)` | No keyboard | `c.onActivate(...)` |
| Missing focus styles | Inaccessible | Add `:focus-visible` |

## Review Process

### Step 1: Examine Code Changes

Read through all modified files systematically.

### Step 2: Check Each Focus Area

Go through the checklists above for each file.

### Step 3: Identify Issues

Flag issues by severity:
- **Critical** - Security or crash risk
- **High** - Performance or accessibility issue
- **Medium** - Code smell or maintenance concern
- **Low** - Style or minor improvement

### Step 4: Provide Specific Feedback

Include:
- File path and line number
- Issue description
- Code example showing problem
- Code example showing fix

### Step 5: Assess Overall Quality

Rate the code in each area:
- Security: Secure / Minor Issues / Vulnerable
- Accessibility: Excellent / Good / Needs Work / Poor
- Performance: Optimized / Acceptable / Needs Work
- Code Quality: Clean / Acceptable / Needs Refactoring

## Output Format

```markdown
## Code Review Summary

**Files Reviewed:** [list]
**Overall Assessment:** [Ready / Needs Changes / Major Revision]

### Critical Issues (Block Merge)
- **[file:line]** - [description]
  ```javascript
  // Current (wrong)
  code

  // Fixed
  code
  ```

### High Priority Issues
[same format]

### Medium Priority Issues
[same format]

### Suggestions
[improvements that aren't required]

### What Went Well
- [positive feedback]

### Scores
- Security: [rating]
- Accessibility: [rating]
- Performance: [rating]
- Code Quality: [rating]
```

## Quick Review Commands

```bash
# Lint check
npm run lint

# Find security issues
grep -r '\${' blocks/ --include="*.js" | grep -v 'esc('

# Find memory leaks
grep -r 'addEventListener' blocks/ --include="*.js"

# Find state mutations
grep -r 'c\.state\.' blocks/ --include="*.js" | grep -E '(\+\+|--|=(?!=))'

# Find magic numbers in CSS
grep -r '[0-9]\+px' blocks/ --include="*.css" | grep -v 'var(--'

# Find missing lazy loading
grep -r '<img' blocks/ --include="*.js" | grep -v 'loading='
```

## Integration with Other Skills

| After review... | Use skill... |
|-----------------|--------------|
| Need to fix block issues | `building-blocks` |
| Need performance testing | `performance-audit` |
| Need full validation | `testing-blocks` |
