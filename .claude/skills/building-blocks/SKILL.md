# Building Blocks Skill

## Overview

This skill provides guidance for creating new AEM Edge Delivery blocks or modifying existing ones in the Behr EDS project. It uses the custom framework in `/scripts/lib/` for consistent, performant, and accessible components.

## Prerequisites

**REQUIRED**: Complete the `content-driven-development` skill first.

Before proceeding, you must have:
- [ ] Test content created (local HTML or Google Drive)
- [ ] Content model defined (what authors will provide)
- [ ] Test content URL accessible

## Block Types

### Stateless Blocks (Presentational)

Use for static content display: hero, cards, footer, testimonials.

**Characteristics:**
- Extract content from EDS-generated DOM
- No reactive state needed
- Minimal JavaScript logic
- Uses atoms to rebuild HTML

### Stateful Components (Interactive)

Use for interactive features: color-picker, cart, forms, filters.

**Characteristics:**
- Requires state management
- User interactions trigger updates
- May subscribe to stores
- Uses component factory with lifecycle

## Implementation Steps

### Step 1: Verify Prerequisites

Confirm you have:
- Test content URL: `_______________________`
- Content model documented: Yes / No
- CDD skill completed: Yes / No

### Step 2: Find Similar Blocks

Search existing codebase for patterns:

```bash
# List existing blocks
ls -la blocks/

# Search for similar functionality
grep -r "defineComponent" blocks/
grep -r "export default function decorate" blocks/
```

Use the `block-inventory` skill if needed.

### Step 3: Create Block Structure

```bash
mkdir -p blocks/{block-name}
touch blocks/{block-name}/{block-name}.js
touch blocks/{block-name}/{block-name}.css
```

### Step 4: Implement JavaScript

#### Stateless Block Template

```javascript
// blocks/{block-name}/{block-name}.js
import {
  h2, text, button, link,
  container, stack, cluster,
  esc
} from '../../scripts/lib/index.js';

/**
 * Decorates the {block-name} block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // 1. Extract content from EDS-generated DOM
  const rows = [...block.children];
  const heading = block.querySelector('h2')?.textContent || '';
  const content = block.querySelector('p')?.textContent || '';
  const img = block.querySelector('img');
  const link = block.querySelector('a');

  // 2. Rebuild using atoms (ALWAYS escape dynamic content)
  block.innerHTML = container(
    stack(
      h2(esc(heading), { className: '{block-name}__heading' }),
      text(esc(content), { className: '{block-name}__text' }),
      img ? `<img src="${img.src}" alt="${esc(img.alt)}" loading="lazy">` : '',
      link ? buttonLink(esc(link.textContent), link.href, { variant: 'primary' }) : ''
    ),
    { className: '{block-name}__container' }
  );
}
```

#### Stateful Component Template

```javascript
// blocks/{block-name}/{block-name}.js
import {
  defineComponent, createComponent,
  h2, text, button, stack, container,
  esc
} from '../../scripts/lib/index.js';
// Import stores if needed
// import colorCart from '../../scripts/stores/color-cart.js';

defineComponent('{block-name}', {
  defaultState: {
    items: [],
    loading: false,
    filter: null
  },

  /**
   * Setup - runs once on creation
   * Parse initial content, fetch data
   */
  setup(c) {
    // Parse content from EDS block
    c.items = [...c.el.querySelectorAll(':scope > div')]
      .map(row => ({
        id: Date.now() + Math.random(),
        text: row.textContent.trim()
      }));
  },

  /**
   * Mounted - runs after first render
   * Bind events, subscribe to stores
   */
  mounted(c) {
    // Event delegation (auto-cleanup on destroy)
    c.on('click', '.btn-action', (e, el) => {
      const id = el.dataset.id;
      // Handle action
    });

    // Keyboard + click support
    c.onActivate('.item', (e, el) => {
      // Handles Enter/Space keys too
    });

    // Store subscription (auto-cleanup)
    // c.subscribe(colorCart, () => c.render());
  },

  /**
   * Render - returns HTML string
   * Called on state changes
   */
  render(c) {
    const { items, loading, filter } = c.state;

    if (loading) {
      return '<div class="{block-name}__loading">Loading...</div>';
    }

    return container(
      stack(
        h2('{Block Name}'),
        `<div class="{block-name}__grid">
          ${items.map(item => `
            <div class="{block-name}__item item" data-id="${item.id}">
              ${esc(item.text)}
            </div>
          `).join('')}
        </div>`,
        button('Action', { className: 'btn-action', variant: 'primary' })
      ),
      { className: '{block-name}__container' }
    );
  }
});

export default function decorate(block) {
  createComponent('{block-name}', block);
}
```

### Step 5: Add CSS Styling

```css
/* blocks/{block-name}/{block-name}.css */

/* Block container */
.{block-name} {
    display: block;
    padding: var(--space-8) 0;
}

/* Inner container */
.{block-name}__container {
    max-width: var(--container-lg);
    margin: 0 auto;
    padding: 0 var(--gutter);
}

/* Heading */
.{block-name}__heading {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
}

/* Grid layout */
.{block-name}__grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* Interactive items */
.{block-name}__item {
    padding: var(--space-4);
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: transform var(--duration-fast) var(--ease-out),
                box-shadow var(--duration-fast) var(--ease-out);
}

.{block-name}__item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

/* REQUIRED: Focus state for accessibility */
.{block-name}__item:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
}

/* Loading state */
.{block-name}__loading {
    padding: var(--space-6);
    text-align: center;
    color: var(--color-text-secondary);
}

/* Responsive */
@media (width <= 768px) {
    .{block-name}__heading {
        font-size: var(--font-size-2xl);
    }

    .{block-name}__grid {
        grid-template-columns: 1fr;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .{block-name}__item {
        transition: none;
    }
}
```

### Step 6: Test Implementation

Use the `testing-blocks` skill:

1. **Visual testing** - Preview at `http://localhost:3000`
2. **Responsive testing** - Check all breakpoints
3. **Accessibility testing** - Keyboard nav, screen reader
4. **Lint check** - `npm run lint`

### Step 7: Document the Block

Add JSDoc comments and update author documentation if needed.

## Framework Reference

### Available Atoms

| Atom | Purpose |
|------|---------|
| `h1`-`h6`, `heading` | Headings |
| `text`, `lead`, `small`, `caption` | Text elements |
| `button`, `link`, `buttonLink` | Interactive elements |
| `input`, `select` | Form elements |
| `stack`, `cluster` | Flex layouts |
| `container`, `card` | Containers |
| `colorSwatch`, `icon` | Domain-specific |
| `richText` | Trusted HTML only |

### Component Lifecycle

```
setup() → render() → mounted() → [setState → render]* → destroy()
```

### Design Tokens

See `/styles/styles.css` for full list:
- Colors: `--color-*`
- Spacing: `--space-*`
- Typography: `--font-size-*`, `--font-weight-*`
- Layout: `--container-*`, `--gutter`
- Shapes: `--radius-*`, `--shadow-*`

## Best Practices Checklist

### JavaScript
- [ ] Imports from `/scripts/lib/index.js`
- [ ] Uses atoms (not raw HTML strings)
- [ ] All dynamic content escaped with `esc()`
- [ ] Event delegation via `c.on()` / `c.onActivate()`
- [ ] State updates via `setState()` (never mutate)
- [ ] No `console.log` in production

### CSS
- [ ] Uses design tokens (no magic numbers)
- [ ] BEM-like naming: `.{block}__element--modifier`
- [ ] Mobile-first responsive
- [ ] Focus states styled (`:focus-visible`)
- [ ] Reduced motion support
- [ ] No `!important`

### Accessibility
- [ ] Semantic HTML
- [ ] ARIA labels on icon buttons
- [ ] Keyboard navigation via `onActivate()`
- [ ] Color contrast WCAG AA
- [ ] Focus indicators visible

### Performance
- [ ] Images lazy-loaded with optimization params
- [ ] Debounced expensive operations
- [ ] Event delegation (not per-element listeners)
