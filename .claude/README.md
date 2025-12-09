# Claude Code Configuration for Adobe EDS

This directory contains Claude Code configuration files optimized for Adobe Edge Delivery Services (EDS) development.

## Directory Structure

```
.claude/
├── README.md                    # This file
├── commands/                    # Slash commands
│   ├── review.md               # /review - Code review
│   ├── block.md                # /block - Generate blocks
│   ├── performance.md          # /performance - Performance audit
│   └── anti-patterns.md        # /anti-patterns - Scan for issues
└── docs/                       # Documentation
    └── best-practices.md       # EDS best practices guide
```

## Available Commands

### `/review` - Comprehensive Code Review
Performs a thorough code review focused on:
- Architecture & patterns compliance
- Security vulnerabilities (XSS, CSP violations)
- Performance optimization
- CSS design token usage
- Accessibility compliance
- Code quality

**Usage:**
```
/review
```

**When to use:**
- Before committing code
- During pull request reviews
- After completing a feature
- When refactoring code

---

### `/block` - Generate New Block Component
Scaffolds a new Adobe EDS block component with best practices baked in.

**Usage:**
```
/block
```

Claude will ask clarifying questions:
- Block name (kebab-case)
- Block purpose
- Stateless (presentational) or stateful (interactive)?
- Required content/data
- Interactions needed
- Store integration needed?

**Generates:**
- `/blocks/[name]/[name].js` - Component logic
- `/blocks/[name]/[name].css` - Scoped styles
- Usage instructions

---

### `/performance` - Performance Audit
Analyzes the codebase for performance issues and optimization opportunities.

**Usage:**
```
/performance
```

**Checks:**
- Bundle size (<100KB eager load budget)
- Loading strategy (eager/lazy/delayed)
- Image optimization
- CSS performance
- JavaScript performance
- Third-party scripts
- Font loading
- LCP optimization
- CLS prevention
- Debouncing/throttling

**Output:**
- Performance score
- Critical issues with fixes
- Optimization recommendations
- Estimated impact

---

### `/anti-patterns` - Anti-Pattern Scanner
Scans codebase for common Adobe EDS anti-patterns and code smells.

**Usage:**
```
/anti-patterns
```

**Detects:**
- **Security:** XSS vulnerabilities, unescaped content
- **Memory leaks:** Uncleaned event listeners, subscriptions
- **State management:** Direct mutations, unnecessary re-renders
- **HTML generation:** Raw strings instead of atoms
- **CSS:** Magic numbers, missing focus states
- **Performance:** Unoptimized images, missing debouncing
- **Accessibility:** Missing ARIA labels, no keyboard support
- **EDS-specific:** Wrong block structure, broken conventions

**Output:**
- Categorized issues (Critical/High/Medium/Low)
- Specific file paths and line numbers
- Code examples and fixes

---

## Best Practices Documentation

### [best-practices.md](docs/best-practices.md)

Comprehensive guide covering:

#### Architecture Principles
- Block-first design
- Zero external dependencies
- Lightweight & performance-focused
- Progressive enhancement

#### Block Development
- Stateless vs stateful patterns
- Component lifecycle
- Block file structure
- Naming conventions

#### JavaScript Patterns
- Using framework atoms
- Always escape user content
- Event delegation
- State management
- Store subscriptions

#### CSS & Styling
- Design token system
- Available tokens (colors, spacing, typography, etc.)
- BEM-like naming conventions
- Responsive design (mobile-first)

#### Performance Guidelines
- Critical metrics (Lighthouse 100, LCP <1.5s, CLS <0.1)
- Optimization checklist
- Lazy loading strategies
- Image optimization
- Event delegation
- Debouncing

#### Security
- XSS prevention with `esc()`
- Using atoms (built-in escaping)
- `richText()` for trusted content only
- CSP compliance

#### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation with `onActivate()`
- Focus management
- Reduced motion support

#### Common Anti-Patterns
- Direct DOM manipulation
- State mutations
- Memory leaks
- Mixed HTML patterns
- CSS magic numbers

#### Testing & Quality Checklist
Pre-commit verification checklist

---

## Quick Reference

### Essential Framework Imports

```javascript
import {
  // Typography atoms
  h1, h2, h3, text, lead, small,

  // Interactive atoms
  button, link, buttonLink, input, select,

  // Layout atoms
  stack, cluster, container, card,

  // Domain atoms
  colorSwatch, icon,

  // Component system
  defineComponent, createComponent,

  // Utilities
  esc, cx, attrs, uid, debounce,

  // Events
  on, onActivate
} from '../../scripts/lib/index.js';

// Stores
import { colorCart } from '../../scripts/stores/color-cart.js';
```

### Design Token Categories

```css
/* Colors */
var(--color-primary)
var(--color-text-primary)
var(--color-surface-primary)

/* Spacing */
var(--space-4)  /* 16px */
var(--space-sm) /* semantic */

/* Typography */
var(--font-size-lg)
var(--font-weight-bold)
var(--line-height-normal)

/* Shapes */
var(--radius-md)
var(--shadow-md)

/* Layout */
var(--container-lg)
var(--gutter)
```

### Component Lifecycle

```javascript
defineComponent('my-block', {
  defaultState: { /* initial state */ },

  setup(c) {
    // Runs once on creation
    // Initialize data, parse content
  },

  mounted(c) {
    // Runs after first render
    // Bind events, subscribe to stores
    c.on('click', '.btn', handler);
    c.subscribe(store, handler);
  },

  render(c) {
    // Returns HTML string
    // Called on state changes
    return `<div>${c.state.value}</div>`;
  },

  destroy(c) {
    // Optional cleanup
    // Auto-handles events and subscriptions
  }
});
```

### Performance Checklist

- [ ] Eager bundle <100KB
- [ ] Images optimized (`?width=X&format=webp`)
- [ ] Images lazy-loaded (except LCP)
- [ ] Design tokens used (no magic numbers)
- [ ] Event delegation (no individual listeners)
- [ ] Expensive ops debounced
- [ ] State updates optimized
- [ ] Lighthouse score >95

### Security Checklist

- [ ] All user content escaped with `esc()`
- [ ] Atoms used for HTML generation
- [ ] `richText()` only for EDS content
- [ ] No inline event handlers
- [ ] No `eval()` or `Function()`

### Accessibility Checklist

- [ ] Semantic HTML elements
- [ ] ARIA labels on icon buttons
- [ ] `onActivate()` for keyboard support
- [ ] Focus states styled (`:focus-visible`)
- [ ] Color contrast WCAG AA
- [ ] Reduced motion support

---

## Local Development

### Start Local Server
```bash
aem up
```
→ http://localhost:3000

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

### Performance Testing
```bash
# Install lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

---

## Workflow Recommendations

### Before Coding
1. Read [best-practices.md](docs/best-practices.md)
2. Use `/block` to scaffold new components
3. Review existing patterns in `/blocks/`

### During Development
1. Use framework atoms (not raw HTML)
2. Always escape user content with `esc()`
3. Follow design token system
4. Test keyboard navigation
5. Check responsive behavior

### Before Committing
1. Run `/review` on changed files
2. Run `/anti-patterns` to catch issues
3. Run `/performance` if significant changes
4. Run `npm run lint`
5. Test in browser (http://localhost:3000)
6. Check Lighthouse score
7. Verify no console errors

### During Code Review
1. Use `/review` command for automated checks
2. Verify performance impact
3. Check accessibility compliance
4. Ensure security best practices

---

## Common Patterns

### Stateless Block (Presentational)
```javascript
export default function decorate(block) {
  const content = block.querySelector('p')?.textContent;

  block.innerHTML = container(
    h1(esc(content))
  );
}
```

### Stateful Component (Interactive)
```javascript
defineComponent('my-component', {
  defaultState: { count: 0 },

  mounted(c) {
    c.on('click', '.btn', () => {
      c.setState({ count: c.state.count + 1 });
    });
  },

  render(c) {
    return `<div>${c.state.count}</div>`;
  }
});

export default function decorate(block) {
  createComponent('my-component', block);
}
```

---

## Resources

- [Adobe EDS Documentation](https://www.aem.live/developer/tutorial)
- [Project README](../README.md)
- [Best Practices Guide](docs/best-practices.md)

---

## Support

For questions or issues with Claude Code configuration:
1. Check [best-practices.md](docs/best-practices.md)
2. Review existing blocks in `/blocks/`
3. Use slash commands for guidance (`/review`, `/block`, etc.)

---

**Generated for:** Behr EDS Project
**Claude Code Version:** Latest
**Last Updated:** 2025-12-09
