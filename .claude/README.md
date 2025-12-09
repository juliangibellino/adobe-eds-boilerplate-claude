# Claude Code Configuration for Behr EDS

This directory contains Claude Code configuration and AI coding agent skills optimized for Adobe Edge Delivery Services development.

## Directory Structure

```
.claude/
├── README.md                    # This file
├── settings.local.json          # Local Claude Code settings
├── skills/                      # AI agent skills (Adobe pattern)
│   ├── content-driven-development/  # Orchestrator - start here
│   ├── building-blocks/         # Block creation patterns
│   ├── block-inventory/         # Survey existing blocks
│   ├── testing-blocks/          # Validation procedures
│   ├── docs-search/             # AEM documentation search
│   ├── code-review/             # Code quality review
│   └── performance-audit/       # Performance analysis
├── commands/                    # Slash commands (legacy)
│   ├── review.md               # /review - Code review
│   ├── block.md                # /block - Generate blocks
│   ├── performance.md          # /performance - Performance audit
│   └── anti-patterns.md        # /anti-patterns - Scan for issues
└── docs/
    └── best-practices.md       # EDS best practices guide
```

## Skills System (Recommended)

Skills follow Adobe's pattern for AI coding agents. They provide structured guidance for development tasks.

### Discovering Skills

```bash
# Run discovery script
./.agents/discover-skills

# Or list directly
ls .claude/skills/
```

### Available Skills

| Skill | Type | Purpose |
|-------|------|---------|
| `content-driven-development` | **Orchestrator** | Start here for ALL development |
| `building-blocks` | Functional | Create/modify blocks |
| `block-inventory` | Research | Find existing patterns |
| `testing-blocks` | Functional | Validate implementations |
| `docs-search` | Research | Search AEM.live docs |
| `code-review` | Functional | Review code quality |
| `performance-audit` | Functional | Audit performance |

### Using Skills

1. **Read the SKILL.md file** for the skill you need
2. **Follow all instructions** in order
3. **Use referenced skills** when indicated

**Example - Creating a new block:**
```
content-driven-development (start)
  → building-blocks (implementation)
    → testing-blocks (validation)
```

### Key Principle: Content Driven Development

> **NEVER start writing code without first creating test content.**

This is Adobe's core principle for EDS development. The `content-driven-development` skill enforces this pattern.

## Slash Commands (Legacy)

These commands are still available but skills are preferred:

| Command | Equivalent Skill |
|---------|------------------|
| `/review` | `code-review` skill |
| `/block` | `building-blocks` skill |
| `/performance` | `performance-audit` skill |
| `/anti-patterns` | `code-review` skill |

## Quick Start

### For New Development

1. Start with the `content-driven-development` skill
2. Create test content first
3. Use `building-blocks` for implementation
4. Use `testing-blocks` for validation

### For Code Review

1. Use the `code-review` skill
2. Follow the checklist in the skill file

### For Performance Issues

1. Use the `performance-audit` skill
2. Run Lighthouse and bundle analysis

## Project Framework Reference

### Imports

```javascript
import {
  // Typography
  h1, h2, h3, text, lead, small,
  // Interactive
  button, link, buttonLink, input, select,
  // Layout
  stack, cluster, container, card,
  // Domain
  colorSwatch, icon,
  // Components
  defineComponent, createComponent,
  // Utils
  esc, cx, attrs, uid, debounce
} from '../../scripts/lib/index.js';

// Stores
import colorCart from '../../scripts/stores/color-cart.js';
```

### Design Tokens

```css
/* Colors */
var(--color-brand-primary)
var(--color-text-primary)
var(--color-surface-raised)

/* Spacing */
var(--space-4)  /* 16px */
var(--space-sm) /* semantic */

/* Typography */
var(--font-size-lg)
var(--font-weight-bold)

/* Shapes */
var(--radius-md)
var(--shadow-md)
```

### Component Lifecycle

```javascript
defineComponent('my-block', {
  defaultState: { },
  setup(c) { },      // Initialize
  mounted(c) { },    // Bind events
  render(c) { },     // Return HTML
  destroy(c) { }     // Cleanup
});
```

## Development Workflow

### Before Coding
1. Run `./.agents/discover-skills` to see available skills
2. Start with `content-driven-development` skill
3. Create test content before writing code

### During Development
1. Use framework atoms (not raw HTML)
2. Escape all dynamic content with `esc()`
3. Use design tokens (no magic numbers)
4. Use event delegation (`c.on()`, `c.onActivate()`)

### Before Committing
1. Run `npm run lint`
2. Use `testing-blocks` skill for validation
3. Use `code-review` skill for quality check
4. Test in browser at http://localhost:3000

## Resources

- [AGENTS.md](../AGENTS.md) - Full AI agent instructions
- [AEM.live Documentation](https://www.aem.live/developer/tutorial)
- [Block Collection](https://www.aem.live/developer/block-collection)
- [Best Practices](docs/best-practices.md)

---

**Project:** Behr EDS
**Skills Pattern:** Adobe AI Coding Agents
**Last Updated:** 2025-12-09
