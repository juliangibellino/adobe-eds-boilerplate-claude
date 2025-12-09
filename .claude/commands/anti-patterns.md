Scan the codebase for anti-patterns and code smells specific to Adobe EDS development.

## Anti-Pattern Categories

### 1. Security Issues (CRITICAL)

#### XSS Vulnerabilities
**Pattern:** Unescaped user content in template literals

```javascript
// ❌ CRITICAL - XSS vulnerability
const unsafe = `<div>${userInput}</div>`;
const unsafe2 = `<h1>${props.title}</h1>`;

// ✅ CORRECT - Escaped
import { esc } from '../../scripts/lib/index.js';
const safe = `<div>${esc(userInput)}</div>`;
const safe2 = h1(props.title); // Atoms auto-escape
```

**Search for:**
- Template literals with `${` that don't use `esc()`
- Direct innerHTML assignments without escaping
- `richText()` used with non-EDS content

#### Improper richText() Usage
**Pattern:** Using richText() for user-generated content

```javascript
// ❌ CRITICAL - XSS if userContent is not trusted
const unsafe = richText(userContent);

// ✅ CORRECT - richText() only for EDS-authored content
const safe = richText(edsGeneratedHTML);
const safe2 = text(userContent); // Auto-escaped
```

---

### 2. Memory Leaks

#### Individual Event Listeners
**Pattern:** Adding listeners without cleanup

```javascript
// ❌ WRONG - Memory leak
mounted(c) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', handler);
  });
  window.addEventListener('resize', handler);
}

// ✅ CORRECT - Auto cleanup
mounted(c) {
  c.on('click', '.btn', handler);
  c.on('resize', handler); // Component handles cleanup
}
```

**Search for:**
- `addEventListener` calls not wrapped in component methods
- Event listeners on `window`, `document` without cleanup
- Timers (`setTimeout`, `setInterval`) without cleanup

#### Unsubscribed Store Listeners
**Pattern:** Manual store subscriptions without cleanup

```javascript
// ❌ WRONG - Subscription never cleaned up
mounted(c) {
  colorCart.subscribe(() => {
    c.render();
  });
}

// ✅ CORRECT - Auto cleanup
mounted(c) {
  c.subscribe(colorCart, () => {
    c.render();
  });
}
```

---

### 3. State Management Issues

#### Direct State Mutation
**Pattern:** Mutating state directly instead of using setState

```javascript
// ❌ WRONG - No re-render triggered
mounted(c) {
  c.state.count++;
  c.state.items.push(newItem);
  c.state.user.name = 'John';
}

// ✅ CORRECT - Triggers re-render
mounted(c) {
  c.setState({ count: c.state.count + 1 });
  c.setState({ items: [...c.state.items, newItem] });
  c.setState({ user: { ...c.state.user, name: 'John' } });
}
```

**Search for:**
- `c.state.` followed by assignment operators (`=`, `++`, `--`, `+=`)
- Array mutating methods on state (`push`, `pop`, `splice`, `shift`)
- Object property assignments on nested state

#### Unnecessary Re-renders
**Pattern:** Setting state to the same value

```javascript
// ❌ WRONG - Re-renders even if value unchanged
c.setState({ value: newValue });

// ✅ CORRECT - Only update if changed
if (newValue !== c.state.value) {
  c.setState({ value: newValue });
}
```

---

### 4. HTML Generation Issues

#### Raw HTML Strings Instead of Atoms
**Pattern:** Using template literals instead of framework atoms

```javascript
// ❌ WRONG - Inconsistent, no XSS protection, verbose
const html = `
  <div class="container">
    <h1 class="title">${title}</h1>
    <p class="text">${content}</p>
    <button class="btn btn-primary">Click</button>
  </div>
`;

// ✅ CORRECT - Using atoms
const html = container(
  stack(
    h1(title, { className: 'title' }),
    text(content, { className: 'text' }),
    button('Click', { variant: 'primary' })
  )
);
```

**Search for:**
- Template literals with HTML tags that could use atoms
- Hardcoded button/link/heading HTML
- Not importing from `/scripts/lib/index.js`

#### Mixing Patterns
**Pattern:** Mixing atoms with raw HTML

```javascript
// ❌ WRONG - Inconsistent
const mixed = `
  <div>
    ${h1('Title')}
    <p>Raw paragraph</p>
  </div>
`;

// ✅ CORRECT - All atoms
const consistent = container(
  h1('Title'),
  text('Raw paragraph')
);
```

---

### 5. CSS Anti-Patterns

#### Magic Numbers
**Pattern:** Hardcoded values instead of design tokens

```css
/* ❌ WRONG - Magic numbers */
.block {
  padding: 24px;
  gap: 16px;
  font-size: 18px;
  color: #333;
  border-radius: 8px;
}

/* ✅ CORRECT - Design tokens */
.block {
  padding: var(--space-6);
  gap: var(--space-4);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
}
```

**Search for:**
- Pixel values (`px`) not using CSS variables
- Hex colors not using CSS variables
- Hardcoded font sizes

#### Missing Focus States
**Pattern:** No focus indicators for interactive elements

```css
/* ❌ WRONG - No focus state */
.interactive {
  cursor: pointer;
}
.interactive:hover {
  background: var(--color-primary);
}

/* ✅ CORRECT - Has focus state */
.interactive:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

#### Layout-Shifting Animations
**Pattern:** Animating layout properties

```css
/* ❌ WRONG - Causes reflow */
.block {
  transition: margin 200ms;
}
.block:hover {
  margin-top: -4px;
}

/* ✅ CORRECT - Uses transform */
.block {
  transition: transform 200ms;
}
.block:hover {
  transform: translateY(-4px);
}
```

---

### 6. Performance Issues

#### Images Without Optimization
**Pattern:** Images missing lazy loading or optimization params

```javascript
// ❌ WRONG - No optimization
`<img src="${src}" alt="${alt}">`

// ❌ WRONG - All images lazy (even LCP)
`<img src="${src}" alt="${alt}" loading="lazy">`

// ✅ CORRECT - Below fold with optimization
`<img
  src="${src}?width=2000&format=webp"
  alt="${esc(alt)}"
  width="2000"
  height="1200"
  loading="lazy"
>`

// ✅ CORRECT - LCP image
`<img
  src="${src}?width=2000&format=webp"
  alt="${esc(alt)}"
  width="2000"
  height="1200"
  loading="eager"
  fetchpriority="high"
>`
```

**Search for:**
- `<img` tags without `loading` attribute
- `<img` tags without width/height
- Image src without `?width=` or `format=webp`

#### Missing Debouncing
**Pattern:** Expensive operations without debouncing

```javascript
// ❌ WRONG - Runs on every keystroke
c.on('input', '.search', (e, el) => {
  fetchSearchResults(el.value); // Expensive!
});

// ✅ CORRECT - Debounced
import { debounce } from '../../scripts/lib/index.js';

const handleSearch = debounce((query) => {
  fetchSearchResults(query);
}, 300);

c.on('input', '.search', (e, el) => {
  handleSearch(el.value);
});
```

**Search for:**
- Event handlers on `input`, `scroll`, `resize` without debounce
- API calls in event handlers without debounce

#### Eager Loading Non-Critical Resources
**Pattern:** Loading resources in critical path unnecessarily

```javascript
// ❌ WRONG - Blocking render
import heavyLibrary from './heavy-lib.js';

// ✅ CORRECT - Lazy load
mounted(c) {
  import('./heavy-lib.js').then(lib => {
    // Use library
  });
}
```

---

### 7. Accessibility Issues

#### Missing ARIA Labels
**Pattern:** Icon buttons without labels

```javascript
// ❌ WRONG - No label for screen readers
button('', { icon: 'close', variant: 'ghost' })

// ✅ CORRECT - Has aria-label
button('', {
  icon: 'close',
  variant: 'ghost',
  ariaLabel: 'Close dialog'
})
```

#### Click Without Keyboard Support
**Pattern:** Using `on('click')` instead of `onActivate()`

```javascript
// ❌ WRONG - No keyboard support
c.on('click', '.color-swatch', (e, el) => {
  selectColor(el.dataset.id);
});

// ✅ CORRECT - Supports Enter/Space keys
c.onActivate('.color-swatch', (e, el) => {
  selectColor(el.dataset.id);
});
```

#### Non-Semantic HTML
**Pattern:** Using divs instead of semantic elements

```javascript
// ❌ WRONG - Div soup
`<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>`

// ✅ CORRECT - Semantic HTML
`<header>
  <nav>
    ${link('Home', { href: '/' })}
  </nav>
</header>`
```

---

### 8. EDS-Specific Issues

#### Wrong Block Structure
**Pattern:** Incorrect file organization

```
❌ WRONG
/blocks/my-block.js
/blocks/my-block.css

✅ CORRECT
/blocks/my-block/my-block.js
/blocks/my-block/my-block.css
```

#### Missing decorate() Export
**Pattern:** Not exporting default decorate function

```javascript
// ❌ WRONG
export function myBlock(block) { }

// ✅ CORRECT
export default function decorate(block) { }
```

#### Breaking EDS DOM Structure
**Pattern:** Removing critical EDS classes

```javascript
// ❌ WRONG - Breaks EDS
block.className = 'my-custom-class';

// ✅ CORRECT - Preserves block class
block.classList.add('my-custom-class');
// Or rebuild with atoms but keep structure
```

---

### 9. Code Quality Issues

#### Console Logs in Production
**Pattern:** Debugging statements left in code

```javascript
// ❌ WRONG
console.log('Debug info:', data);
console.warn('This is happening');

// ✅ CORRECT - Remove or guard
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

#### Import from Wrong Path
**Pattern:** Not using unified entry point

```javascript
// ❌ WRONG - Direct imports
import { h1 } from '../../scripts/lib/atoms.js';
import { esc } from '../../scripts/lib/utils.js';

// ✅ CORRECT - Unified import
import { h1, esc } from '../../scripts/lib/index.js';
```

#### Duplicate Code
**Pattern:** Copy-pasted logic that should be abstracted

**Look for:**
- Similar component patterns across blocks
- Repeated utility functions
- Duplicate CSS rules

---

## Scanning Process

1. **Run automated searches** for common patterns:
   ```bash
   # Find unescaped template literals
   grep -r '\${[^}]*}' blocks/ | grep -v 'esc('

   # Find addEventListener calls
   grep -r 'addEventListener' blocks/

   # Find direct state mutations
   grep -r 'c.state\.' blocks/ | grep -E '(\+\+|--|\+=|-=|=(?!=))'

   # Find magic numbers in CSS
   grep -r '[0-9]\+px' blocks/ | grep -v 'var(--'

   # Find images without lazy loading
   grep -r '<img' blocks/ | grep -v 'loading='

   # Find console.log
   grep -r 'console\.' blocks/ scripts/
   ```

2. **Manually review** files for:
   - Proper atom usage
   - Component lifecycle correctness
   - Accessibility compliance
   - Performance best practices

3. **Check imports** for consistency:
   - All using `/scripts/lib/index.js`
   - No direct lib/* imports

4. **Review state management**:
   - No direct mutations
   - Proper setState usage
   - Store subscriptions using `c.subscribe()`

## Output Format

Provide findings in this structure:

### Critical Issues (Fix Immediately)
- **[File:Line]** - [Issue type]
  - Problem: [description]
  - Risk: [security/performance/crash]
  - Fix: [code example]

### High Priority Issues
[Same format]

### Medium Priority Issues
[Same format]

### Code Smells / Improvement Opportunities
[Same format]

### Summary
- Total issues found: ___
- Critical: ___
- High: ___
- Medium: ___
- Low: ___

### Most Common Anti-Patterns
1. [Pattern name] - [count] occurrences
2. [Pattern name] - [count] occurrences

---

Now scan the codebase for anti-patterns.
