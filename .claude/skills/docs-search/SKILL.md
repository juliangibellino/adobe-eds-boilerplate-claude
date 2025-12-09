# Docs Search Skill

## Overview

This skill enables searching AEM Edge Delivery Services documentation at aem.live to find information about platform features, best practices, and implementation guidance.

## When to Use

Use this skill when you need:
- Information about AEM EDS features or APIs
- Best practices from official documentation
- Implementation guidance not found in project code
- Answers to "how does X work in AEM?"

**Do NOT use for**:
- General web development questions (use standard knowledge)
- Finding code examples (use `block-inventory` skill)
- Creating new blocks (use `building-blocks` skill)

## Search Process

### Step 1: Identify Keywords

Choose 1-3 specific, relevant terms:

**Good keywords:**
- `block decoration`
- `metadata`
- `sidekick`
- `content modeling`
- `lighthouse`

**Avoid generic terms:**
- `how to`
- `best`
- `make`
- `aem` (automatically filtered)

### Step 2: Search Documentation

Use web search or fetch to find relevant aem.live pages:

```
Search: site:aem.live {keywords}
```

Or fetch specific documentation pages:

**Core Documentation:**
- https://www.aem.live/developer/tutorial - Getting started
- https://www.aem.live/developer/block-collection - Block patterns
- https://www.aem.live/developer/markup-sections-blocks - Content structure
- https://www.aem.live/developer/keeping-it-100 - Performance guide

**Common Topics:**
| Topic | URL Path |
|-------|----------|
| Blocks | `/developer/block-collection` |
| Markup | `/developer/markup-sections-blocks` |
| Performance | `/developer/keeping-it-100` |
| Sidekick | `/developer/sidekick` |
| Indexing | `/developer/indexing` |
| Spreadsheets | `/developer/spreadsheets` |

### Step 3: Fetch and Review

Once you identify relevant pages:

```
WebFetch: https://www.aem.live{path}
```

Review the top 2-3 most relevant results before expanding search.

## Integration Notes

### Project-Specific Context

This Behr EDS project has custom extensions:

| Standard AEM | Behr EDS Custom |
|--------------|-----------------|
| `aem.js` utilities | Custom `/scripts/lib/` framework |
| Basic block decoration | Component factory pattern |
| Vanilla CSS | Design token system |
| Direct DOM manipulation | Template atoms |

When applying AEM documentation:
1. Understand the core concept from docs
2. Adapt to project's custom patterns
3. Use framework atoms instead of raw HTML
4. Apply design tokens instead of hardcoded values

### Related Skills

| If you need... | Use skill... |
|----------------|--------------|
| Code examples from other projects | `block-inventory` |
| Create/modify blocks | `building-blocks` |
| Test block implementation | `testing-blocks` |
| Full development workflow | `content-driven-development` |

## Common Documentation Sections

### Block Development
- Block structure and naming conventions
- Decoration patterns
- Auto-blocking
- Block variants

### Content Authoring
- Document structure
- Section metadata
- Block options
- Spreadsheet data

### Performance
- Core Web Vitals
- Lighthouse optimization
- Lazy loading strategies
- Image optimization

### Publishing
- Preview vs Live
- Sidekick usage
- Cache invalidation
- Custom domains

## Tips

1. **Start specific** - Search for exact feature names first
2. **Check dates** - AEM EDS evolves; prefer recent documentation
3. **Look for examples** - Docs often include code snippets
4. **Cross-reference** - Verify with project's implementation
5. **Note deprecations** - Some features may be deprecated

## Example Searches

| Question | Search Terms |
|----------|--------------|
| "How do I add metadata to a page?" | `metadata head` |
| "How do blocks get loaded?" | `block loading decoration` |
| "How do I optimize images?" | `image optimization webp` |
| "How does the sidekick work?" | `sidekick preview publish` |
| "How do I use spreadsheet data?" | `spreadsheets json` |
