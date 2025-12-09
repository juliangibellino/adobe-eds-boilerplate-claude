/**
 * Behr EDS Framework - Unified Exports
 * @fileoverview Single import point for the framework
 */

// Utils
export {
  esc, cx, attrs, uid, debounce,
} from './utils.js';

// Atoms
export {
  heading,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  text,
  lead,
  small,
  caption,
  richText,
  button,
  link,
  buttonLink,
  input,
  select,
  stack,
  cluster,
  card,
  container,
  colorSwatch,
  icon,
} from './atoms.js';

// Events
export { default as events } from './events.js';

// Components
export {
  defineComponent, createComponent, initComponents, destroyComponents,
} from './component.js';
