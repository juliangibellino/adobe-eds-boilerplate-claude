# Block Inventory Skill

## Overview

This skill surveys available blocks in the Behr EDS project and the AEM Block Collection to understand the "block palette" available for development and authoring decisions.

## When to Use

Use this skill when:
- Starting a new feature to find similar existing patterns
- Planning content structure for a page
- Need to understand what blocks already exist
- Looking for code examples to learn from
- Determining if a new block is needed or can reuse existing

## Inventory Process

### Step 1: Scan Local Blocks

List existing blocks in this project:

```bash
ls -la blocks/
```

**Current Behr EDS Blocks:**

| Block | Type | Purpose |
|-------|------|---------|
| `hero` | Stateless | Large promotional banner with image, heading, CTA |
| `header` | Stateless | Site navigation with mobile menu |
| `footer` | Stateless | Site footer with links |
| `cards` | Stateless | Grid of content cards |
| `color-picker` | Stateful | Interactive color palette with cart integration |
| `cart-badge` | Stateful | Display count of saved colors |

### Step 2: Review Block Implementation

For each block, understand:

```bash
# Check if stateless or stateful
grep -l "defineComponent" blocks/*/\*.js  # Stateful
grep -l "export default function decorate" blocks/*/\*.js  # Stateless

# Check store integrations
grep -l "colorCart" blocks/*/\*.js
```

### Step 3: Check AEM Block Collection

Common blocks available from Adobe's Block Collection:

| Block | Purpose | URL |
|-------|---------|-----|
| `hero` | Page introduction | [Block Collection](https://www.aem.live/developer/block-collection#hero) |
| `cards` | Grid layouts | [Block Collection](https://www.aem.live/developer/block-collection#cards) |
| `columns` | Side-by-side content | [Block Collection](https://www.aem.live/developer/block-collection#columns) |
| `accordion` | Expandable sections | [Block Collection](https://www.aem.live/developer/block-collection#accordion) |
| `tabs` | Tabbed content | [Block Collection](https://www.aem.live/developer/block-collection#tabs) |
| `carousel` | Image/content slider | [Block Collection](https://www.aem.live/developer/block-collection#carousel) |
| `quote` | Testimonials/quotes | [Block Collection](https://www.aem.live/developer/block-collection#quote) |
| `fragment` | Reusable content | [Block Collection](https://www.aem.live/developer/block-collection#fragment) |

### Step 4: Document Findings

Create an inventory summary:

```markdown
## Available Blocks

### Local Project Blocks
- hero - Stateless - Behr-styled hero with brand colors
- color-picker - Stateful - Custom color selection with cart
- ...

### Block Collection Candidates
- accordion - Could use for FAQs
- tabs - Could use for product specs
- ...

### Recommended Approach
- [Reuse existing | Extend existing | Create new]
```

## Block Analysis Template

When analyzing a block for reuse:

```markdown
### Block: {name}

**Location:** blocks/{name}/
**Type:** Stateless | Stateful
**Dependencies:** [stores, external APIs]

**Content Model:**
| Row | Content |
|-----|---------|
| 1 | ... |
| 2 | ... |

**Variants:** [list any block variants]

**Reusability Score:** High | Medium | Low
- Can be extended: Yes/No
- Matches requirements: Yes/Partially/No
```

## Quick Reference Commands

```bash
# List all blocks
ls blocks/

# Find stateful components
grep -r "defineComponent" blocks/ --include="*.js"

# Find store usage
grep -r "import.*from.*stores" blocks/ --include="*.js"

# Check block CSS size
du -h blocks/*/*.css

# Find blocks with specific functionality
grep -r "onActivate" blocks/ --include="*.js"  # Keyboard accessible
grep -r "loading=" blocks/ --include="*.js"     # Lazy loading
```

## Integration with Other Skills

| After inventory... | Use skill... |
|--------------------|--------------|
| Found similar block to extend | `building-blocks` |
| Need to create new block | `content-driven-development` first |
| Want to see AEM docs examples | `docs-search` |
| Ready to test block | `testing-blocks` |

## This Skill Does NOT

- Determine which block fits specific needs (that's your decision)
- Create new blocks (use `building-blocks`)
- Validate block functionality (use `testing-blocks`)
- Provide implementation guidance (use `building-blocks`)

This skill only **surveys and catalogs** available options.
