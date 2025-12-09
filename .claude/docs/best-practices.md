# Adobe EDS Best Practices & Code Style Guide

This document outlines the coding standards, patterns, and best practices for this Adobe Edge Delivery Services (EDS) project.

## Table of Contents
- [Architecture Principles](#architecture-principles)
- [Block Development](#block-development)
- [JavaScript Patterns](#javascript-patterns)
- [CSS & Styling](#css--styling)
- [Performance Guidelines](#performance-guidelines)
- [Security](#security)
- [Accessibility](#accessibility)

---

## Architecture Principles

### 1. Block-First Design
- All features should be developed as **blocks** in `/blocks/[block-name]/`
- Each block is self-contained with its own JS and CSS
- Blocks are decorated from content authored in Google Drive/markdown

### 2. Zero External Dependencies
- Use **vanilla JavaScript** only
- Leverage the custom framework in `/scripts/lib/`
- No React, Vue, jQuery, or other libraries unless absolutely critical

### 3. Lightweight & Performance-Focused
- **Eager load budget: <100KB** (critical CSS + JS)
- Lazy-load non-critical assets (fonts, secondary CSS)
- Use event delegation instead of individual listeners

### 4. Progressive Enhancement
- Start with semantic HTML
- Enhance with JavaScript for interactivity
- Ensure core functionality works without JS when possible

---

## Block Development

### Block Types

#### Stateless Blocks (Static Content)
Use for presentational components (hero, cards, footer):

```javascript
// blocks/hero/hero.js
import { h1, text, button, container, stack } from '../../scripts/lib/index.js';

export default function decorate(block) {
  // Extract content from EDS-generated DOM
  const [imageRow, contentRow] = [...block.children];
  const img = imageRow.querySelector('img');
  const heading = contentRow.querySelector('h1')?.textContent;
  const body = contentRow.querySelector('p')?.textContent;

  // Rebuild using atoms
  block.innerHTML = container(
    stack(
      h1(heading),
      text(body),
      button('Learn More', { variant: 'primary' })
    )
  );
}
```

#### Stateful Blocks (Interactive Components)
Use for components with state/reactivity (color-picker, cart-badge):

```javascript
// blocks/my-component/my-component.js
import { defineComponent, createComponent } from '../../scripts/lib/index.js';
import { colorCart } from '../../scripts/stores/color-cart.js';

defineComponent('my-component', {
  defaultState: {
    filter: null,
    items: []
  },

  setup(c) {
    // Initialize data, fetch, etc.
    c.setState({ items: fetchItems() });
  },

  mounted(c) {
    // Bind events using delegation
    c.on('click', '.btn-add', (e, el) => {
      const id = el.dataset.id;
      c.setState({ items: [...c.state.items, id] });
    });

    // Subscribe to store changes
    c.subscribe(colorCart, (storeState) => {
      // Re-render when store updates
      c.render();
    });
  },

  render(c) {
    const { items } = c.state;
    return `
      <div class="my-component">
        ${items.map(item => `<div>${item}</div>`).join('')}
      </div>
    `;
  }
});

export default function decorate(block) {
  createComponent('my-component', block);
}
```

### Block File Structure
```
/blocks/[block-name]/
├── [block-name].js      # REQUIRED: Export default decorate(block)
└── [block-name].css     # REQUIRED: Block-specific styles
```

### Block Naming Conventions
- Use **kebab-case** for block names: `color-picker`, `cart-badge`
- JS filename matches block name: `color-picker.js`
- CSS filename matches block name: `color-picker.css`
- Component names match block names in `defineComponent()`

---

## JavaScript Patterns

### Import Framework Utilities
```javascript
// Always import from unified entry point
import {
  h1, h2, text, button, link, stack, container,
  defineComponent, createComponent,
  esc, cx, attrs, uid,
  on, onActivate
} from '../../scripts/lib/index.js';

// Import stores
import { colorCart } from '../../scripts/stores/color-cart.js';
```

### Use Template Atoms for HTML Generation
**ALWAYS** use atoms instead of raw HTML strings:

```javascript
// ✅ CORRECT - Using atoms
const html = container(
  h1('Welcome', { className: 'title' }),
  text('This is safe content'),
  button('Click Me', { variant: 'primary', onclick: 'handleClick()' })
);

// ❌ WRONG - Raw HTML (XSS risk, inconsistent)
const html = `
  <div class="container">
    <h1 class="title">${userInput}</h1>
    <button>Click Me</button>
  </div>
`;
```

### Always Escape User Content
Use `esc()` utility for any dynamic/user-provided content:

```javascript
import { esc } from '../../scripts/lib/index.js';

// ✅ CORRECT
const safe = `<div>${esc(userInput)}</div>`;

// ❌ WRONG - XSS vulnerability
const unsafe = `<div>${userInput}</div>`;
```

### Event Delegation Pattern
Use component event delegation, NOT individual listeners:

```javascript
// ✅ CORRECT - Delegated events
mounted(c) {
  c.on('click', '.btn-action', (e, el) => {
    // Handler only fires for .btn-action clicks
    console.log('Clicked:', el);
  });

  c.onActivate('.interactive', (e, el) => {
    // Handles both click AND keyboard (Enter/Space)
    performAction();
  });
}

// ❌ WRONG - Individual listeners (memory leak, performance)
mounted(c) {
  c.$$('.btn-action').forEach(btn => {
    btn.addEventListener('click', handler); // No cleanup!
  });
}
```

### State Management
- Use `setState()` for component state (triggers re-render)
- Use stores for shared state across components
- Never mutate state directly

```javascript
// ✅ CORRECT
c.setState({ count: c.state.count + 1 });

// ❌ WRONG
c.state.count++; // No re-render triggered!
```

### Store Subscription Pattern
```javascript
mounted(c) {
  // Subscribe to store updates
  c.subscribe(colorCart, (storeState) => {
    // storeState is the new store state
    c.render(); // Re-render when store changes
  });

  // Component auto-cleans up subscription on destroy
}
```

---

## CSS & Styling

### Design Token System
ALWAYS use CSS custom properties from `/styles/styles.css`:

```css
/* ✅ CORRECT - Using design tokens */
.my-block {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-primary);
}

/* ❌ WRONG - Magic numbers and hardcoded values */
.my-block {
  color: #333;
  font-size: 18px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
}
```

### Available Design Tokens

**Colors:**
- `--color-primary`, `--color-secondary`
- `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
- `--color-surface-primary`, `--color-surface-secondary`, `--color-surface-tertiary`
- `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- `--color-neutral-*` (100-900)

**Typography:**
- `--font-size-xs` through `--font-size-6xl`
- `--font-weight-normal`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`
- `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed`

**Spacing:**
- `--space-1` through `--space-24` (4px increments)
- Semantic: `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`

**Layout:**
- `--container-sm`, `--container-md`, `--container-lg`, `--container-xl`
- `--gutter` (responsive)

**Shapes:**
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### BEM-like Naming Convention
```css
/* Block */
.color-picker { }

/* Elements */
.color-picker__header { }
.color-picker__grid { }
.color-picker__swatch { }

/* Modifiers */
.color-picker__swatch--selected { }
.color-picker__swatch--disabled { }

/* State */
.color-picker__swatch:hover { }
.color-picker__swatch:focus-visible { }
```

### Responsive Design
Use mobile-first approach:

```css
/* Mobile base styles */
.block {
  padding: var(--space-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .block {
    padding: var(--space-6);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .block {
    padding: var(--space-8);
  }
}
```

---

## Performance Guidelines

### Critical Metrics
- **Lighthouse Score:** 100/100/100/100 target
- **LCP (Largest Contentful Paint):** <1.5s
- **CLS (Cumulative Layout Shift):** <0.1
- **Eager Load Budget:** <100KB (CSS + JS)

### Optimization Checklist

#### 1. Lazy Loading
```javascript
// ✅ Load non-critical resources after LCP
document.addEventListener('DOMContentLoaded', () => {
  // Load fonts
  loadCSS('/styles/fonts.css');

  // Load lazy styles
  loadCSS('/styles/lazy-styles.css');
});
```

#### 2. Image Optimization
```javascript
// Use EDS-optimized images
const img = `
  <picture>
    <source media="(max-width: 768px)" srcset="${src}?width=750&format=webp">
    <source media="(min-width: 769px)" srcset="${src}?width=2000&format=webp">
    <img src="${src}?width=2000&format=webp" alt="${esc(alt)}" loading="lazy">
  </picture>
`;
```

#### 3. Event Delegation
```javascript
// ✅ CORRECT - Single delegated listener
on('click', '.btn', handler);

// ❌ WRONG - Listener per element
document.querySelectorAll('.btn').forEach(el => {
  el.addEventListener('click', handler);
});
```

#### 4. Debounce Expensive Operations
```javascript
import { debounce } from '../../scripts/lib/index.js';

const handleSearch = debounce((query) => {
  // Expensive search operation
}, 300);
```

#### 5. Minimize Re-renders
```javascript
// Only update state when value actually changes
if (newValue !== c.state.value) {
  c.setState({ value: newValue });
}
```

---

## Security

### XSS Prevention

#### ALWAYS Escape User Content
```javascript
import { esc } from '../../scripts/lib/index.js';

// ✅ CORRECT
const safe = h1(esc(userInput));
const safe2 = `<div>${esc(userInput)}</div>`;

// ❌ WRONG
const unsafe = `<div>${userInput}</div>`;
```

#### Use Atoms (Built-in Escaping)
Atoms automatically escape content:
```javascript
// ✅ Safe - content is auto-escaped
button(userProvidedText, { variant: 'primary' });
h1(unsafeContent);
text(dynamicContent);
```

#### Only Use richText() for Trusted Content
```javascript
import { richText } from '../../scripts/lib/index.js';

// ✅ CORRECT - EDS-authored content only
const safeHTML = richText(edsGeneratedHTML);

// ❌ WRONG - User content
const unsafe = richText(userInput); // XSS VULNERABILITY!
```

### Content Security Policy
Follow CSP best practices:
- No inline scripts (use external JS)
- No `eval()` or `Function()` constructors
- No inline event handlers (`onclick=""`)

```javascript
// ✅ CORRECT
button('Click', { onclick: 'handleClick()' }); // Generates data attribute, handled by delegation

// ❌ WRONG
const btn = `<button onclick="alert('xss')">Click</button>`; // CSP violation
```

---

## Accessibility

### Semantic HTML
Use semantic atoms for proper document structure:

```javascript
// ✅ CORRECT
const page = `
  <header>${nav}</header>
  <main>
    <article>
      ${h1('Title')}
      ${text('Content')}
    </article>
  </main>
  <footer>${footerContent}</footer>
`;

// ❌ WRONG
const page = `
  <div class="header">${nav}</div>
  <div class="main">
    <div class="article">
      <div class="title">Title</div>
      <div>Content</div>
    </div>
  </div>
`;
```

### ARIA Labels
Provide labels for interactive elements:

```javascript
button('', {
  icon: 'close',
  ariaLabel: 'Close dialog',
  variant: 'ghost'
});

input('', {
  type: 'search',
  placeholder: 'Search colors...',
  ariaLabel: 'Search colors'
});
```

### Keyboard Navigation
Use `onActivate()` for keyboard-accessible interactions:

```javascript
mounted(c) {
  // Handles both click AND Enter/Space keys
  c.onActivate('.color-swatch', (e, el) => {
    selectColor(el.dataset.colorId);
  });
}
```

### Focus Management
```css
/* Always style focus states */
.interactive:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
.interactive:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## File Organization

```
/behr-eds/
├── blocks/                      # Block components
│   └── [block-name]/
│       ├── [block-name].js      # Decorate function
│       └── [block-name].css     # Block styles
├── scripts/
│   ├── lib/                     # Framework core
│   │   ├── index.js            # Unified exports
│   │   ├── atoms.js            # HTML generators
│   │   ├── component.js        # Component factory
│   │   ├── events.js           # Event delegation
│   │   └── utils.js            # Utilities
│   ├── stores/                  # Shared state
│   │   └── [store-name].js
│   ├── scripts.js               # Entry point
│   ├── aem.js                   # EDS utilities
│   └── delayed.js               # Post-load scripts
├── styles/
│   ├── styles.css               # Design tokens + base
│   ├── lazy-styles.css          # Non-critical CSS
│   └── fonts.css                # Font loading
└── [content].html               # EDS-generated pages
```

---

## Common Anti-Patterns to Avoid

### ❌ Direct DOM Manipulation in Components
```javascript
// WRONG
mounted(c) {
  c.$('.item').innerHTML = 'New content'; // Breaks reactivity!
}

// CORRECT
mounted(c) {
  c.setState({ content: 'New content' }); // Triggers render
}
```

### ❌ Mutating State Directly
```javascript
// WRONG
c.state.items.push(newItem); // No re-render!

// CORRECT
c.setState({ items: [...c.state.items, newItem] });
```

### ❌ Memory Leaks with Event Listeners
```javascript
// WRONG
mounted(c) {
  window.addEventListener('resize', handler); // Never cleaned up!
}

// CORRECT
mounted(c) {
  c.on('resize', handler); // Auto cleanup on destroy
}
```

### ❌ Mixing Atoms and Raw HTML
```javascript
// WRONG - Inconsistent
const mixed = `
  <div>
    ${h1('Title')}
    <p>Raw HTML paragraph</p>
  </div>
`;

// CORRECT - All atoms
const consistent = container(
  h1('Title'),
  text('Paragraph using atom')
);
```

### ❌ CSS Magic Numbers
```javascript
// WRONG
.block {
  padding: 24px;
  gap: 16px;
}

// CORRECT
.block {
  padding: var(--space-6);
  gap: var(--space-4);
}
```

---

## Testing & Quality Checklist

Before committing code, verify:

- [ ] Uses framework atoms for HTML generation
- [ ] All user content is escaped with `esc()`
- [ ] Event delegation instead of individual listeners
- [ ] Design tokens used (no magic numbers)
- [ ] Semantic HTML structure
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus states styled
- [ ] Mobile responsive
- [ ] No ESLint errors (`npm run lint`)
- [ ] Lighthouse score >95 on all metrics
- [ ] No console errors
- [ ] Works with reduced motion preference

---

## Getting Help

- **Documentation:** [Adobe EDS Docs](https://www.aem.live/developer/tutorial)
- **Local Dev:** `aem up` → http://localhost:3000
- **Linting:** `npm run lint`
- **Testing:** `npm test`
