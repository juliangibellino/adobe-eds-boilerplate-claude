# AI Coding Agent Instructions

This document provides guidance for AI coding agents (Claude Code, Cursor, Copilot, etc.) working on the Behr EDS project.

## Critical Requirement

**YOU ARE REQUIRED TO USE THE SKILLS IN `.claude/skills/` TO ACCOMPLISH DEVELOPMENT TASKS.**

For any development involving blocks, core scripts, or functionality, you **must start with the `content-driven-development` skill**, which orchestrates additional skills as needed.

## Skill System

Skills are specialized instructions for common development tasks. They ensure consistency, reduce errors, and maintain alignment with project standards.

### Skill Location

All skills are in `.claude/skills/` with this structure:
```
.claude/skills/{skill-name}/
├── SKILL.md          # Main instructions (REQUIRED to read)
├── scripts/          # Helper scripts (if any)
└── resources/        # Templates, examples (if any)
```

### Available Skills

| Skill | Type | Purpose |
|-------|------|---------|
| `content-driven-development` | Orchestrator | **Start here** for all development tasks |
| `building-blocks` | Functional | Create or modify block components |
| `block-inventory` | Research | Survey available blocks |
| `testing-blocks` | Functional | Validate block implementations |
| `docs-search` | Research | Search AEM.live documentation |
| `code-review` | Functional | Review code for issues |
| `performance-audit` | Functional | Audit performance metrics |

### Skill Categories

**Orchestration Skills** - Entry points that coordinate workflows:
- `content-driven-development` - The primary orchestrator for ALL development

**Functional Skills** - Specialized sub-tasks:
- `building-blocks` - Block creation patterns
- `testing-blocks` - Validation procedures
- `code-review` - Code quality checks
- `performance-audit` - Performance analysis

**Research Skills** - Information gathering:
- `block-inventory` - Catalog existing blocks
- `docs-search` - Find AEM documentation

## How to Use Skills

### Step 1: Discover Available Skills

Run the discovery script to see available skills:
```bash
./.agents/discover-skills
```

Or list the skills directory:
```bash
ls .claude/skills/
```

### Step 2: Select Appropriate Skill

Choose based on your task:

| Task | Start With |
|------|------------|
| Create new block | `content-driven-development` |
| Modify existing block | `content-driven-development` |
| Fix a bug in a block | `content-driven-development` |
| Review code | `code-review` |
| Check performance | `performance-audit` |
| Find existing patterns | `block-inventory` |
| Look up AEM docs | `docs-search` |

### Step 3: Execute the Skill

1. **Read the full SKILL.md** file for the selected skill
2. **Announce** which skill you're using
3. **Follow all instructions** in the skill file
4. **Complete all steps** before moving on
5. **Use referenced skills** when indicated

## Workflow Examples

### Creating a New Block

```
1. Start with: content-driven-development
   ├── Define content model
   ├── Create test content
   └── Proceed to building-blocks

2. Use: building-blocks
   ├── Find similar patterns (block-inventory)
   ├── Create block structure
   ├── Implement JS and CSS
   └── Proceed to testing-blocks

3. Use: testing-blocks
   ├── Visual testing
   ├── Accessibility testing
   ├── Performance testing
   └── Code quality check
```

### Code Review

```
1. Use: code-review
   ├── Check architecture
   ├── Check security
   ├── Check performance
   ├── Check accessibility
   └── Provide feedback
```

## Project-Specific Context

### Framework

This project uses a custom framework in `/scripts/lib/`:
- **Atoms** - HTML generation functions (h1, button, container, etc.)
- **Components** - Stateful component factory
- **Events** - Centralized event delegation
- **Stores** - Reactive state management

### Key Differences from Standard AEM

| Standard AEM | Behr EDS |
|--------------|----------|
| Raw HTML manipulation | Use atoms |
| Vanilla event listeners | Use `c.on()` / `c.onActivate()` |
| Direct DOM updates | Use `setState()` |
| Hardcoded styles | Use design tokens |

### Design Tokens

Always use CSS variables from `/styles/styles.css`:
- Colors: `var(--color-*)`
- Spacing: `var(--space-*)`
- Typography: `var(--font-size-*)`, `var(--font-weight-*)`
- Shapes: `var(--radius-*)`, `var(--shadow-*)`

## Do NOT

- Start coding without test content (use CDD skill)
- Use raw HTML strings (use atoms)
- Add per-element event listeners (use delegation)
- Use magic numbers in CSS (use tokens)
- Skip accessibility testing
- Ignore the skill instructions

## Quick Reference

```bash
# Discover skills
./.agents/discover-skills

# Start development
# Always begin with content-driven-development skill

# Run linting
npm run lint

# Start local server
aem up
```

## Resources

- [AEM.live Documentation](https://www.aem.live/developer/tutorial)
- [Block Collection](https://www.aem.live/developer/block-collection)
- [Project Best Practices](.claude/docs/best-practices.md)
