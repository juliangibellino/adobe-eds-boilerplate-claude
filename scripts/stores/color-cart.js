/**
 * Behr EDS Framework - Color Cart Store
 * @fileoverview Reactive state management for saved colors
 */

import Store from './store.js';

/**
 * Color Cart Store
 */
class ColorCartStore extends Store {
  constructor() {
    super('behr-saved-colors', { colors: [], maxColors: 20 });
  }

  get colors() {
    return this.state.colors;
  }

  get count() {
    return this.state.colors.length;
  }

  get isFull() {
    return this.count >= this.state.maxColors;
  }

  hasColor(hex) {
    return this.state.colors.some((c) => c.hex === hex);
  }

  addColor(color) {
    if (this.isFull) return { success: false, reason: 'full' };
    if (this.hasColor(color.hex)) return { success: false, reason: 'duplicate' };

    this.update((s) => ({
      ...s,
      colors: [
        ...s.colors,
        {
          ...color,
          id: Date.now(),
          savedAt: new Date().toISOString(),
        },
      ],
    }));
    return { success: true };
  }

  removeColor(id) {
    this.update((s) => ({
      ...s,
      colors: s.colors.filter((c) => c.id !== id),
    }));
  }

  clear() {
    this.update({ colors: [] });
  }

  reorder(fromIndex, toIndex) {
    this.update((s) => {
      const colors = [...s.colors];
      const [moved] = colors.splice(fromIndex, 1);
      colors.splice(toIndex, 0, moved);
      return { ...s, colors };
    });
  }
}

const colorCart = new ColorCartStore();

export default colorCart;
