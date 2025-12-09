/**
 * Behr EDS Framework - Base Store
 * @fileoverview Base reactive store with persistence
 */

import { debounce } from '../lib/utils.js';

/**
 * Base reactive store with persistence
 */
export default class Store {
  constructor(key, defaultState) {
    this.key = key;
    this.listeners = new Set();
    this.state = this.hydrate(defaultState);

    // Cross-tab synchronization
    this.channel = new BroadcastChannel(key);
    this.channel.onmessage = (e) => {
      this.state = e.data;
      this.notify();
    };
  }

  hydrate(defaultState) {
    try {
      const stored = localStorage.getItem(this.key);
      return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
    } catch {
      return defaultState;
    }
  }

  persist = debounce(() => {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.state));
      this.channel.postMessage(this.state);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Store persist failed:', e);
    }
  }, 100);

  notify() {
    this.listeners.forEach((fn) => fn(this.state));
  }

  subscribe(fn) {
    this.listeners.add(fn);
    fn(this.state); // Immediate callback with current state
    return () => this.listeners.delete(fn);
  }

  update(updater) {
    this.state = typeof updater === 'function' ? updater(this.state) : { ...this.state, ...updater };
    this.notify();
    this.persist();
  }
}
