# Content Driven Development Skill

## Overview

Content Driven Development (CDD) is the **mandatory process** for all AEM Edge Delivery Services development in this project. It prioritizes content and author needs over developer convenience by requiring test content before writing any code.

> **CRITICAL**: NEVER start writing or modifying code without first identifying or creating the content you will use to test your changes.

## When to Use This Skill

Use this skill as the **entry point** for ALL development tasks involving:
- Creating new blocks
- Modifying existing blocks
- Changing core scripts functionality
- Bug fixes that affect rendering
- Any feature that authors will interact with

**Skip CDD only for**: Trivial CSS tweaks, configuration changes, or documentation updates.

## Prerequisites

Before starting:
1. Understand the feature request or bug report
2. Have access to the local development environment (`aem up`)
3. Know where test content should live (Google Drive or local HTML)

## Workflow Phases

### Phase 1: Content Discovery and Modeling

**Step 1.1: Check for Existing Content**

First, determine if there's already content you can use for testing:

```bash
# Search for existing block content in the project
# Check /blocks/ directory for example content in comments
# Check any documentation pages for block examples
```

**Step 1.2: Design the Content Model**

If creating a new block or modifying content structure:

1. Define what content authors will provide:
   - What rows/columns in the table?
   - What content types (text, images, links)?
   - What variations/options?

2. Create an author-friendly structure:
   ```
   | Block Name |
   |------------|
   | Required content row 1 |
   | Optional content row 2 |
   ```

3. Document the "author contract" - the expected structure

**Step 1.3: Create Test Content**

Create test content using one of these methods:

**Option A: Local HTML file** (recommended for development)
```html
<!-- test/blocks/my-block.html -->
<div class="my-block">
  <div>
    <div>First cell content</div>
    <div>Second cell content</div>
  </div>
</div>
```

**Option B: Google Drive document**
- Create a new document in the project's content folder
- Add a table with your block name as header
- Fill in test content
- Preview at `http://localhost:3000/path-to-doc`

### Phase 2: Implementation

**Step 2.1: Invoke Building Blocks Skill**

Once you have test content, use the `building-blocks` skill:

1. Reference the test content URL
2. Follow the block creation/modification patterns
3. Test continuously against your content

**Step 2.2: Implement Using Framework**

For this Behr EDS project, use the custom framework:

```javascript
import {
  h1, h2, text, button, link,
  container, stack, cluster, card,
  defineComponent, createComponent,
  esc
} from '../../scripts/lib/index.js';
```

See `building-blocks` skill for detailed patterns.

### Phase 3: Validation

**Step 3.1: Test All Variants**

Test your implementation with:
- [ ] All content variations (empty, minimal, full, overflow)
- [ ] All responsive breakpoints (mobile, tablet, desktop)
- [ ] Light/dark modes if applicable
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

**Step 3.2: Run Quality Checks**

```bash
# Lint code
npm run lint

# Run tests
npm test

# Check performance impact
# Use browser DevTools Lighthouse
```

**Step 3.3: Prepare for PR**

Include in your PR:
- Link to test content URL
- Screenshots of rendered block
- Description of content model
- Any breaking changes to author experience

## Integration with Other Skills

This skill orchestrates:

| Phase | Skill to Use |
|-------|-------------|
| Content modeling | `content-driven-development` (this skill) |
| Finding similar patterns | `block-inventory` |
| Block implementation | `building-blocks` |
| Testing | `testing-blocks` |
| Documentation lookup | `docs-search` |

## Test Content Serves Multiple Purposes

1. **Development** - See changes immediately
2. **PR Validation** - Reviewers can verify functionality
3. **Author Documentation** - Shows expected usage
4. **Edge Case Discovery** - Real content reveals issues code-first misses

## Common Mistakes to Avoid

1. **Starting with code** - Always start with content
2. **Skipping variations** - Test all content permutations
3. **Ignoring mobile** - Test responsive from the start
4. **No accessibility testing** - Use keyboard and screen readers
5. **Missing documentation** - Update author docs with implementation

## Quick Reference

```
Content First → Content Model → Test Content → Implementation → Validation
```

**Remember**: The author experience is the product. Code is just the means to deliver it.
