Generate a new Adobe EDS block component following best practices.

## Instructions

You will create a new block with the following structure:
```
/blocks/[block-name]/
├── [block-name].js
└── [block-name].css
```

## Block Type Selection

First, determine which pattern to use:

### Stateless Block Pattern
Use for **static/presentational content** (hero, cards, footer):
- Content is extracted from EDS-generated DOM
- No reactive state needed
- Minimal JavaScript logic
- Uses atoms to rebuild HTML

### Stateful Component Pattern
Use for **interactive/data-driven components** (color-picker, cart, forms):
- Requires state management
- User interactions trigger updates
- May need to subscribe to stores
- Uses component factory with lifecycle

## Generation Steps

1. **Ask clarifying questions:**
   - What is the block name? (kebab-case)
   - What is the block's purpose?
   - Is it stateless (presentational) or stateful (interactive)?
   - What content/data does it display?
   - What interactions does it support?
   - Does it need to connect to a store?

2. **Create the JavaScript file** (`/blocks/[name]/[name].js`)

3. **Create the CSS file** (`/blocks/[name]/[name].css`)

4. **Provide usage instructions**

## Stateless Block Template

```javascript
// blocks/[name]/[name].js
import {
  h1, h2, text, button, link,
  container, stack, cluster,
  esc
} from '../../scripts/lib/index.js';

/**
 * Decorates the [name] block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Extract content from EDS-generated DOM
  const content = block.querySelector('p')?.textContent || '';
  const heading = block.querySelector('h2')?.textContent || '';
  const img = block.querySelector('img');

  // Rebuild using atoms
  block.innerHTML = container(
    stack(
      h2(esc(heading), { className: '[name]__heading' }),
      img ? `<img src="${img.src}" alt="${esc(img.alt)}" loading="lazy">` : '',
      text(esc(content), { className: '[name]__text' }),
      button('Learn More', {
        variant: 'primary',
        className: '[name]__cta'
      })
    ),
    { className: '[name]__container' }
  );
}
```

## Stateful Component Template

```javascript
// blocks/[name]/[name].js
import {
  defineComponent,
  createComponent,
  h2, button, stack, container,
  esc
} from '../../scripts/lib/index.js';

/**
 * [Name] component definition
 */
defineComponent('[name]', {
  /**
   * Default component state
   */
  defaultState: {
    items: [],
    loading: false,
    error: null
  },

  /**
   * Setup lifecycle - runs once on creation
   * @param {Component} c Component instance
   */
  setup(c) {
    // Initialize data, fetch content, parse block content
    const initialData = [...c.root.children].map(child => ({
      text: child.textContent,
      id: Date.now()
    }));

    c.setState({ items: initialData });
  },

  /**
   * Mounted lifecycle - runs after first render
   * @param {Component} c Component instance
   */
  mounted(c) {
    // Bind events using delegation
    c.on('click', '.btn-add', (e, el) => {
      const newItem = { text: 'New Item', id: Date.now() };
      c.setState({
        items: [...c.state.items, newItem]
      });
    });

    c.onActivate('.item', (e, el) => {
      // Keyboard accessible (Enter/Space) + click
      const id = el.dataset.id;
      handleItemClick(id);
    });

    // Subscribe to stores if needed
    // c.subscribe(someStore, (storeState) => {
    //   c.render(); // Re-render on store updates
    // });
  },

  /**
   * Render function - returns HTML string
   * @param {Component} c Component instance
   * @returns {string} HTML string
   */
  render(c) {
    const { items, loading, error } = c.state;

    if (loading) return '<div class="[name]__loading">Loading...</div>';
    if (error) return `<div class="[name]__error">${esc(error)}</div>`;

    return container(
      stack(
        h2('[Name] Component', { className: '[name]__heading' }),
        `<div class="[name]__items">
          ${items.map(item => `
            <div class="[name]__item item" data-id="${item.id}">
              ${esc(item.text)}
            </div>
          `).join('')}
        </div>`,
        button('Add Item', {
          className: 'btn-add',
          variant: 'primary'
        })
      ),
      { className: '[name]__container' }
    );
  }
});

/**
 * Decorates the [name] block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  createComponent('[name]', block);
}
```

## CSS Template

```css
/* blocks/[name]/[name].css */

/* Block container */
.[name] {
  display: block;
  padding: var(--space-8) 0;
}

/* Container */
.[name]__container {
  max-width: var(--container-lg);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

/* Heading */
.[name]__heading {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}

/* Items container */
.[name]__items {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* Individual item */
.[name]__item {
  padding: var(--space-4);
  background: var(--color-surface-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 200ms var(--ease-out);
}

.[name]__item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.[name]__item:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Loading/Error states */
.[name]__loading,
.[name]__error {
  padding: var(--space-6);
  text-align: center;
  color: var(--color-text-secondary);
}

.[name]__error {
  color: var(--color-error);
}

/* Responsive */
@media (max-width: 768px) {
  .[name]__heading {
    font-size: var(--font-size-2xl);
  }

  .[name]__items {
    grid-template-columns: 1fr;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .[name]__item {
    transition: none;
  }
}
```

## Best Practices Checklist

Ensure the generated block follows these rules:

### JavaScript
- [ ] Imports from `/scripts/lib/index.js`
- [ ] Uses atoms for HTML generation (not raw strings)
- [ ] All dynamic content escaped with `esc()`
- [ ] Event delegation (no individual listeners)
- [ ] State updates use `setState()` (never mutate directly)
- [ ] Component name matches block name (kebab-case)
- [ ] JSDoc comments for functions
- [ ] No console.log statements

### CSS
- [ ] Uses design tokens (no magic numbers)
- [ ] BEM-like naming: `.[block]__[element]--[modifier]`
- [ ] Mobile-first responsive design
- [ ] Focus states styled (`:focus-visible`)
- [ ] Hover states for interactive elements
- [ ] Reduced motion support
- [ ] Semantic spacing (`var(--space-*)`)
- [ ] Semantic colors (`var(--color-*)`)

### Accessibility
- [ ] Semantic HTML elements
- [ ] ARIA labels where needed
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

### Performance
- [ ] Images lazy-loaded (`loading="lazy"`)
- [ ] No unnecessary re-renders
- [ ] Debounced expensive operations
- [ ] Event delegation for performance

## After Generation

Provide these instructions to the user:

### How to Use This Block

1. **In your EDS document** (Google Drive/markdown), add:
   ```
   | [Name] |
   |--------|
   | Your content here |
   ```

2. **Preview locally:**
   ```bash
   aem up
   ```
   Navigate to your page at http://localhost:3000

3. **Test checklist:**
   - [ ] Block renders correctly
   - [ ] Responsive on mobile/tablet/desktop
   - [ ] Keyboard navigation works
   - [ ] No console errors
   - [ ] Lighthouse score >95

4. **Deploy:**
   - Commit block files to repository
   - EDS auto-deploys on push to main

---

Now generate the block based on user requirements.
