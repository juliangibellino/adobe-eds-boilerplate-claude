/**
 * Behr EDS Framework - Component Factory
 * @fileoverview Factory pattern for stateful, interactive components
 */

import events from './events.js';

const registry = new Map();
const componentInstances = new WeakMap();

/**
 * Define a reusable component
 * @param {string} name - Component identifier
 * @param {Object} definition - Component configuration
 */
export function defineComponent(name, definition) {
  registry.set(name, definition);
}

/**
 * Create component instance
 * @param {string} name - Registered component name
 * @param {HTMLElement} element - DOM element to enhance
 * @param {Object} initialProps - Initial properties
 * @returns {Object} Component API
 */
export function createComponent(name, element, initialProps = {}) {
  const definition = registry.get(name);
  if (!definition) throw new Error(`Component "${name}" not defined`);
  if (componentInstances.has(element)) return componentInstances.get(element);

  // Internal state
  let state = { ...definition.defaultState };
  let props = { ...initialProps };
  const cleanupFns = [];

  // Generate unique scope for event delegation
  const cid = Math.random().toString(36).slice(2, 9);
  element.dataset.cid = cid;
  const scope = `[data-cid="${cid}"]`;

  // Component API
  const api = {
    el: element,

    // State management
    get state() {
      return { ...state };
    },
    setState(updates) {
      const prev = state;
      state = { ...state, ...(typeof updates === 'function' ? updates(state) : updates) };
      if (definition.onStateChange) definition.onStateChange(api, state, prev);
      this.render();
    },

    // Props
    get props() {
      return { ...props };
    },
    setProps(updates) {
      props = { ...props, ...updates };
      this.render();
    },

    // Rendering
    render() {
      if (definition.render) {
        const html = definition.render(api);
        if (html !== undefined) element.innerHTML = html;
      }
    },

    // Scoped event binding (auto-cleanup on destroy)
    on(event, selector, handler) {
      const unsub = events.on(event, `${scope} ${selector}`, handler);
      cleanupFns.push(unsub);
      return unsub;
    },

    // Keyboard + click activation
    onActivate(selector, handler) {
      api.on('click', selector, handler);
      api.on('keydown', selector, (e, el) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler(e, el);
        }
      });
    },

    // Store subscription (auto-cleanup)
    subscribe(store, handler) {
      const unsub = store.subscribe(handler);
      cleanupFns.push(unsub);
      return unsub;
    },

    // Register cleanup function
    onDestroy(fn) {
      cleanupFns.push(fn);
    },

    // Emit custom event
    emit(eventName, detail) {
      element.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: true,
          composed: true,
          detail,
        }),
      );
    },

    // Query helpers
    $(selector) {
      return element.querySelector(selector);
    },
    $$(selector) {
      return [...element.querySelectorAll(selector)];
    },

    // Destroy instance
    destroy() {
      if (definition.destroy) definition.destroy(api);
      cleanupFns.forEach((fn) => fn());
      cleanupFns.length = 0;
      componentInstances.delete(element);
      delete element.dataset.cid;
    },
  };

  // Lifecycle: setup
  if (definition.setup) definition.setup(api);

  // Initial render
  api.render();

  // Lifecycle: mounted
  if (definition.mounted) definition.mounted(api);

  componentInstances.set(element, api);
  return api;
}

/**
 * Auto-initialize components by data attribute
 * @param {Element} root - Root element to search within
 */
export function initComponents(root = document) {
  root.querySelectorAll('[data-component]').forEach((el) => {
    const name = el.dataset.component;
    if (!componentInstances.has(el) && registry.has(name)) {
      createComponent(name, el);
    }
  });
}

/**
 * Destroy all components within root
 * @param {Element} root - Root element
 */
export function destroyComponents(root = document) {
  root.querySelectorAll('[data-component]').forEach((el) => {
    const instance = componentInstances.get(el);
    if (instance) instance.destroy();
  });
}
