# Your Project's Title...

Your project's description...

## Environments

- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Quick Start

1. Install the AEM CLI: `npm install -g @adobe/aem-cli`
2. Install dependencies: `npm install`
3. Start local server: `aem up`
4. Open http://localhost:3000

## Project Structure

- `/blocks` - Block components
- `/scripts/lib` - Behr Framework (atoms, components, events)
- `/scripts/stores` - State management
- `/styles` - Global styles and design tokens

## Framework Features

- **Template Atoms**: Reusable UI primitives via template literals
- **Component Factory**: Stateful blocks with lifecycle management
- **Event Delegation**: Centralized event handling
- **State Management**: Reactive stores with persistence

## Performance Targets

- Lighthouse: 100/100/100/100
- LCP: < 1.5s
- CLS: < 0.1
- Eager budget: < 100KB

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:

1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)
