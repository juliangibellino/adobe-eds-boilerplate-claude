/**
 * Behr EDS Framework - Event Delegation
 * @fileoverview Centralized event delegation system
 */

class EventBus {
  constructor() {
    this.handlers = new Map();
    this.bound = false;
  }

  /**
   * Initialize global listeners
   */
  init() {
    if (this.bound) return;

    ['click', 'change', 'input', 'submit', 'keydown', 'focusin', 'focusout'].forEach((type) => {
      document.addEventListener(type, (e) => this.dispatch(type, e), {
        passive: type !== 'submit',
        capture: type === 'focusin' || type === 'focusout',
      });
    });

    this.bound = true;
  }

  /**
   * Register delegated event handler
   * @param {string} event - Event type
   * @param {string} selector - CSS selector to match
   * @param {Function} handler - (event, matchedElement) => void
   * @returns {Function} Unsubscribe function
   */
  on(event, selector, handler) {
    this.init();
    const key = `${event}::${selector}`;
    if (!this.handlers.has(key)) this.handlers.set(key, new Set());
    this.handlers.get(key).add(handler);
    return () => this.handlers.get(key)?.delete(handler);
  }

  /**
   * Dispatch event to matching handlers
   */
  dispatch(type, event) {
    this.handlers.forEach((handlers, key) => {
      const [eventType, selector] = key.split('::');
      if (eventType !== type) return;

      const target = event.target.closest(selector);
      if (target && document.body.contains(target)) {
        handlers.forEach((fn) => fn(event, target));
      }
    });
  }

  /**
   * Handle both click and keyboard activation (Enter/Space)
   * @param {string} selector - CSS selector
   * @param {Function} handler - Handler function
   */
  onActivate(selector, handler) {
    this.on('click', selector, handler);
    this.on('keydown', selector, (e, el) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler(e, el);
      }
    });
  }
}

const events = new EventBus();

export default events;
