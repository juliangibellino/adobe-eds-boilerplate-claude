# Behr EDS

Marketing website for Behr Paints built on Adobe Edge Delivery Services.

## Quick Start

1. Install the AEM CLI: `npm install -g @adobe/aem-cli`
2. Start local server: `aem up`
3. Open http://localhost:3000

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
