/**
 * Behr EDS Framework - Core Utilities
 * @fileoverview Shared utility functions for the framework
 */

/**
 * HTML escape - REQUIRED for any dynamic content
 * @param {string|null|undefined} str - String to escape
 * @returns {string} Escaped string
 */
export const esc = (str) => {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Conditional class name joining
 * @param {...(string|false|null|undefined)} args - Class names or falsy values
 * @returns {string} Joined class names
 */
export const cx = (...args) => args.filter(Boolean).join(' ');

/**
 * Convert props object to HTML attributes string
 * @param {Object} props - Properties to convert
 * @returns {string} HTML attributes string
 */
export const attrs = (props = {}) => Object.entries(props)
  .filter(([k, v]) => v !== false && v != null && !k.startsWith('_'))
  .map(([k, v]) => {
    if (v === true) return k;
    if (k === 'data' && typeof v === 'object') {
      return Object.entries(v)
        .map(([dk, dv]) => `data-${dk}="${esc(dv)}"`)
        .join(' ');
    }
    return `${k}="${esc(v)}"`;
  })
  .join(' ');

/**
 * Generate unique IDs
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export const uid = (prefix = 'uid') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

/**
 * Debounce function execution
 * @param {Function} fn - Function to debounce
 * @param {number} ms - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (fn, ms = 150) => {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
};
