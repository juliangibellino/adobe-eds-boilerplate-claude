# Using Claude Code with Behr EDS

This guide explains how to use Claude Code effectively with this Adobe Edge Delivery Services project. The project includes specialized AI coding agent skills that help you develop faster while following best practices.

## Table of Contents

- [Quick Start](#quick-start)
- [Understanding Skills](#understanding-skills)
- [Available Skills](#available-skills)
- [Development Workflows](#development-workflows)
- [Project Framework](#project-framework)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Install Claude Code

If you haven't already, install Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Start Claude Code

From the project root:

```bash
claude
```

### 3. Discover Available Skills

Ask Claude to show available skills or run:

```bash
./.agents/discover-skills
```

### 4. Start Development

For any development task, tell Claude:

> "I want to create a new block called `testimonials`. Use the content-driven-development skill."

Claude will guide you through the proper workflow.

---

## Understanding Skills

### What Are Skills?

Skills are structured instructions that guide Claude through specific development tasks. They ensure:

- **Consistency** - Same patterns used across the codebase
- **Quality** - Best practices enforced automatically
- **Efficiency** - Less back-and-forth, faster results

### Skill Categories

| Category | Purpose | Example |
|----------|---------|---------|
| **Orchestrator** | Coordinate complete workflows | `content-driven-development` |
| **Functional** | Execute specific tasks | `building-blocks`, `testing-blocks` |
| **Research** | Gather information | `block-inventory`, `docs-search` |

### How Skills Work Together

```
content-driven-development (start here)
    │
    ├── Define content model
    ├── Create test content
    │
    └── building-blocks (implementation)
            │
            ├── Find similar patterns (block-inventory)
            ├── Create JS and CSS
            │
            └── testing-blocks (validation)
                    │
                    ├── Visual testing
                    ├── Accessibility testing
                    └── Performance testing
```

---

## Available Skills

### content-driven-development (Orchestrator)

**Always start here for development tasks.**

This skill enforces Adobe's Content Driven Development philosophy:

> "Never start writing code without first creating test content."

**Use for:**
- Creating new blocks
- Modifying existing blocks
- Bug fixes that affect rendering
- Any author-facing feature

**Example prompt:**
> "I need to create a FAQ accordion block. Use the content-driven-development skill."

---

### building-blocks (Functional)

Provides patterns for creating or modifying blocks using the project's framework.

**Use for:**
- Block JavaScript implementation
- Block CSS styling
- Component lifecycle patterns
- Framework atom usage

**Example prompt:**
> "Help me implement the JavaScript for my testimonials block using the building-blocks skill."

---

### block-inventory (Research)

Surveys existing blocks in the project and Adobe's Block Collection.

**Use for:**
- Finding similar patterns to reuse
- Understanding available blocks
- Planning new features
- Learning from existing code

**Example prompt:**
> "What blocks already exist in this project? Use the block-inventory skill."

---

### testing-blocks (Functional)

Provides validation procedures for blocks before PR submission.

**Use for:**
- Visual testing checklist
- Accessibility validation
- Performance testing
- Code quality checks

**Example prompt:**
> "Test my new hero block implementation using the testing-blocks skill."

---

### docs-search (Research)

Searches AEM.live documentation for platform features and guidance.

**Use for:**
- Understanding AEM EDS features
- Finding official best practices
- Looking up APIs and patterns

**Example prompt:**
> "How does block auto-loading work in AEM? Use the docs-search skill."

---

### code-review (Functional)

Performs comprehensive code reviews focused on this project's standards.

**Use for:**
- Pre-commit reviews
- Pull request reviews
- Learning best practices
- Finding issues in code

**Example prompt:**
> "Review my changes to the header block using the code-review skill."

---

### performance-audit (Functional)

Analyzes code for performance issues and optimization opportunities.

**Use for:**
- Bundle size analysis
- Core Web Vitals optimization
- Image optimization
- Loading strategy review

**Example prompt:**
> "Audit the performance of this project using the performance-audit skill."

---

## Development Workflows

### Creating a New Block

**Step 1: Start with CDD**
```
You: "I want to create a pricing-table block. Use content-driven-development."
```

**Step 2: Define Content Model**

Claude will ask about:
- What content authors will provide
- Table structure (rows, columns)
- Variations needed

**Step 3: Create Test Content**

Create test content in Google Drive or local HTML:
```html
<!-- Example: test/blocks/pricing-table.html -->
<div class="pricing-table">
  <div>
    <div>Basic</div>
    <div>$9/mo</div>
    <div>Feature 1, Feature 2</div>
  </div>
  <!-- more rows -->
</div>
```

**Step 4: Implementation**

Claude uses `building-blocks` skill to create:
- `blocks/pricing-table/pricing-table.js`
- `blocks/pricing-table/pricing-table.css`

**Step 5: Testing**

Claude uses `testing-blocks` skill to validate:
- Visual rendering
- Responsive behavior
- Accessibility
- Performance

---

### Modifying an Existing Block

```
You: "I need to add a 'featured' variant to the cards block. Use content-driven-development."
```

Claude will:
1. Review existing cards block code
2. Ask about the variant requirements
3. Guide you to create test content with the variant
4. Implement the changes
5. Test the modification

---

### Code Review Before PR

```
You: "Review my recent changes using the code-review skill."
```

Claude will check:
- Security (XSS, escaping)
- Performance (bundle size, lazy loading)
- Accessibility (keyboard, ARIA)
- Code quality (patterns, tokens)

---

### Finding Patterns

```
You: "I need to implement tabs. What similar patterns exist? Use block-inventory."
```

Claude will:
1. List existing project blocks
2. Check Adobe's Block Collection
3. Recommend reuse or new implementation

---

## Project Framework

This project uses a custom framework. Claude's skills are configured to use it correctly.

### Key Imports

```javascript
import {
  // Typography
  h1, h2, h3, text, button, link,
  // Layout
  container, stack, cluster, card,
  // Components
  defineComponent, createComponent,
  // Utilities
  esc, cx, debounce
} from '../../scripts/lib/index.js';
```

### Stateless vs Stateful Blocks

**Stateless** (hero, cards, footer):
```javascript
export default function decorate(block) {
  block.innerHTML = container(h1('Title'));
}
```

**Stateful** (color-picker, forms):
```javascript
defineComponent('my-block', {
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
  createComponent('my-block', block);
}
```

### Design Tokens

Always use CSS variables:

```css
/* Correct */
.block {
  padding: var(--space-4);
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
}

/* Wrong */
.block {
  padding: 16px;
  color: #333;
  font-size: 18px;
}
```

---

## Best Practices

### Do

- **Start with content** - Always create test content before coding
- **Use skills** - They encode project best practices
- **Use atoms** - `h1()`, `button()`, `container()` instead of raw HTML
- **Escape content** - Always use `esc()` for dynamic content
- **Use tokens** - CSS variables for all values
- **Test accessibility** - Keyboard navigation, screen readers

### Don't

- **Don't skip CDD** - Test content first, always
- **Don't use raw HTML** - Framework atoms are safer
- **Don't add listeners manually** - Use `c.on()` for auto-cleanup
- **Don't mutate state** - Use `c.setState()`
- **Don't use magic numbers** - Use design tokens

### Security Checklist

```javascript
// Always escape user content
const safe = `<div>${esc(userInput)}</div>`;

// Use atoms (they auto-escape)
const safe = h1(userInput);

// Only use richText for trusted EDS content
const trusted = richText(edsContent); // Never user input!
```

---

## Troubleshooting

### "Claude isn't using the skill"

Be explicit:
```
"Use the content-driven-development skill to create a new block."
```

### "Claude is writing raw HTML"

Remind it:
```
"Use the framework atoms from /scripts/lib/index.js instead of raw HTML."
```

### "Claude forgot about test content"

```
"Remember: content-driven development. What test content do we need first?"
```

### "Claude is using magic numbers in CSS"

```
"Use design tokens from styles/styles.css instead of hardcoded values."
```

### "The skill file isn't being followed"

Ask Claude to read it:
```
"Read .claude/skills/building-blocks/SKILL.md and follow those instructions."
```

---

## File Reference

```
behr-eds/
├── CLAUDE.md              # This file
├── AGENTS.md              # AI agent instructions
├── .agents/
│   └── discover-skills    # Skill discovery script
├── .claude/
│   ├── skills/            # AI coding skills
│   │   ├── content-driven-development/
│   │   ├── building-blocks/
│   │   ├── block-inventory/
│   │   ├── testing-blocks/
│   │   ├── docs-search/
│   │   ├── code-review/
│   │   └── performance-audit/
│   ├── commands/          # Legacy slash commands
│   └── docs/
│       └── best-practices.md
├── blocks/                # Block components
├── scripts/
│   └── lib/               # Framework library
└── styles/
    └── styles.css         # Design tokens
```

---

## Getting Help

1. **Ask Claude** - "What skills are available?" or "How do I create a block?"
2. **Read skill files** - `cat .claude/skills/{skill-name}/SKILL.md`
3. **Check best practices** - `.claude/docs/best-practices.md`
4. **AEM documentation** - https://www.aem.live/developer/tutorial

---

## Quick Command Reference

```bash
# Start Claude Code
claude

# Discover skills
./.agents/discover-skills

# Start local development server
aem up

# Run linting
npm run lint

# Run tests
npm test
```

---

**Happy coding with Claude!**
