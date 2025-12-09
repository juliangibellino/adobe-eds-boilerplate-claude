/**
 * Behr EDS Framework - Template Atoms
 * @fileoverview Template literal factories for atomic UI elements
 */

import {
  esc, cx, attrs, uid,
} from './utils.js';

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Heading element (h1-h6)
 */
export const heading = (level, content, opts = {}) => {
  const { className, ...rest } = opts;
  const tag = `h${Math.min(Math.max(level, 1), 6)}`;
  const classes = cx('heading', `heading-${level}`, className);
  const safeContent = typeof content === 'string' ? esc(content) : content;
  return `<${tag} class="${classes}" ${attrs(rest)}>${safeContent}</${tag}>`;
};

export const h1 = (content, opts) => heading(1, content, opts);
export const h2 = (content, opts) => heading(2, content, opts);
export const h3 = (content, opts) => heading(3, content, opts);
export const h4 = (content, opts) => heading(4, content, opts);
export const h5 = (content, opts) => heading(5, content, opts);
export const h6 = (content, opts) => heading(6, content, opts);

/**
 * Text/paragraph element with variants
 */
export const text = (content, opts = {}) => {
  const {
    variant, className, tag = 'p', ...rest
  } = opts;
  const classes = cx('text', variant && `text-${variant}`, className);
  return `<${tag} class="${classes}" ${attrs(rest)}>${esc(content)}</${tag}>`;
};

export const lead = (content, opts) => text(content, { ...opts, variant: 'lead' });
export const small = (content, opts) => text(content, { ...opts, variant: 'small' });
export const caption = (content, opts) => text(content, { ...opts, variant: 'caption' });

/**
 * Rich text passthrough - use ONLY for trusted EDS content
 */
export const richText = (html, opts = {}) => {
  const { className, ...rest } = opts;
  return `<div class="${cx('rich-text', className)}" ${attrs(rest)}>${html}</div>`;
};

// =============================================================================
// INTERACTIVE
// =============================================================================

/**
 * Button element
 */
export const button = (label, opts = {}) => {
  const {
    variant = 'primary',
    size,
    icon,
    iconPos = 'start',
    disabled,
    type = 'button',
    className,
    ...rest
  } = opts;

  const classes = cx(
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    icon && 'btn-icon',
    icon && !label && 'btn-icon-only',
    className,
  );

  const iconHtml = icon ? `<span class="btn-icon-el" aria-hidden="true">${icon}</span>` : '';
  const labelHtml = label ? `<span class="btn-label">${esc(label)}</span>` : '';
  const content = iconPos === 'end' ? labelHtml + iconHtml : iconHtml + labelHtml;

  return `<button class="${classes}" type="${type}" ${disabled ? 'disabled' : ''} ${attrs(rest)}>${content}</button>`;
};

/**
 * Link element
 */
export const link = (label, href, opts = {}) => {
  const {
    variant, external, className, ...rest
  } = opts;
  const classes = cx('link', variant && `link-${variant}`, className);
  const externalAttrs = external ? 'target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${esc(href)}" class="${classes}" ${externalAttrs} ${attrs(rest)}>${esc(label)}</a>`;
};

/**
 * Button-styled link
 */
export const buttonLink = (label, href, opts = {}) => {
  const {
    variant = 'primary', size, className, ...rest
  } = opts;
  const classes = cx('btn', `btn-${variant}`, size && `btn-${size}`, className);
  return `<a href="${esc(href)}" class="${classes}" ${attrs(rest)}>${esc(label)}</a>`;
};

// =============================================================================
// FORMS
// =============================================================================

/**
 * Input field with label
 */
export const input = (name, opts = {}) => {
  const {
    type = 'text',
    label,
    placeholder,
    required,
    value,
    error,
    hint,
    className,
    ...rest
  } = opts;

  const id = rest.id || uid('input');
  const classes = cx('form-field', error && 'has-error', className);
  const hintId = hint ? uid('hint') : null;
  const errorId = error ? uid('error') : null;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ');

  return `
    <div class="${classes}">
      ${label ? `<label class="form-label" for="${id}">${esc(label)}${required ? '<span class="form-required" aria-hidden="true">*</span>' : ''}</label>` : ''}
      ${hint ? `<span class="form-hint" id="${hintId}">${esc(hint)}</span>` : ''}
      <input
        type="${type}"
        id="${id}"
        name="${name}"
        class="form-input"
        ${placeholder ? `placeholder="${esc(placeholder)}"` : ''}
        ${value ? `value="${esc(value)}"` : ''}
        ${required ? 'required aria-required="true"' : ''}
        ${describedBy ? `aria-describedby="${describedBy}"` : ''}
        ${error ? 'aria-invalid="true"' : ''}
        ${attrs(rest)}
      />
      ${error ? `<span class="form-error" id="${errorId}" role="alert">${esc(error)}</span>` : ''}
    </div>
  `;
};

/**
 * Select dropdown
 */
export const select = (name, options = [], opts = {}) => {
  const {
    label, required, value, placeholder, className, ...rest
  } = opts;
  const id = rest.id || uid('select');
  const classes = cx('form-field', className);

  return `
    <div class="${classes}">
      ${label ? `<label class="form-label" for="${id}">${esc(label)}${required ? '<span class="form-required">*</span>' : ''}</label>` : ''}
      <select id="${id}" name="${name}" class="form-select" ${required ? 'required' : ''} ${attrs(rest)}>
        ${placeholder ? `<option value="" disabled ${!value ? 'selected' : ''}>${esc(placeholder)}</option>` : ''}
        ${options.map((opt) => {
    const optValue = typeof opt === 'string' ? opt : opt.value;
    const optLabel = typeof opt === 'string' ? opt : opt.label;
    return `<option value="${esc(optValue)}" ${value === optValue ? 'selected' : ''}>${esc(optLabel)}</option>`;
  }).join('')}
      </select>
    </div>
  `;
};

// =============================================================================
// LAYOUT
// =============================================================================

/**
 * Vertical stack
 */
export const stack = (children, opts = {}) => {
  const { gap = 'md', className, ...rest } = opts;
  return `<div class="${cx('stack', `stack-${gap}`, className)}" ${attrs(rest)}>${children}</div>`;
};

/**
 * Horizontal cluster
 */
export const cluster = (children, opts = {}) => {
  const {
    gap = 'md', justify, align, className, ...rest
  } = opts;
  const classes = cx(
    'cluster',
    `cluster-${gap}`,
    justify && `justify-${justify}`,
    align && `align-${align}`,
    className,
  );
  return `<div class="${classes}" ${attrs(rest)}>${children}</div>`;
};

/**
 * Card container
 */
export const card = (children, opts = {}) => {
  const {
    variant, padding = 'md', className, ...rest
  } = opts;
  const classes = cx('card', variant && `card-${variant}`, `card-pad-${padding}`, className);
  return `<article class="${classes}" ${attrs(rest)}>${children}</article>`;
};

/**
 * Page container
 */
export const container = (children, opts = {}) => {
  const { size = 'default', className, ...rest } = opts;
  return `<div class="${cx('container', size !== 'default' && `container-${size}`, className)}" ${attrs(rest)}>${children}</div>`;
};

// =============================================================================
// DOMAIN-SPECIFIC (BEHR)
// =============================================================================

/**
 * Color swatch
 */
export const colorSwatch = (color, opts = {}) => {
  const {
    size = 'md',
    interactive = false,
    selected = false,
    showName = true,
    showCode = false,
    className,
    ...rest
  } = opts;

  const classes = cx(
    'swatch',
    `swatch-${size}`,
    interactive && 'swatch-interactive',
    selected && 'is-selected',
    className,
  );

  const interactiveAttrs = interactive
    ? `role="button" tabindex="0" aria-pressed="${selected}"`
    : '';

  return `
    <div
      class="${classes}"
      style="--swatch-color: ${esc(color.hex)}"
      data-hex="${esc(color.hex)}"
      data-name="${esc(color.name || '')}"
      ${color.id ? `data-id="${esc(color.id)}"` : ''}
      ${interactiveAttrs}
      ${attrs(rest)}
    >
      <span class="swatch-chip"></span>
      <span class="swatch-info">
        ${showName && color.name ? `<span class="swatch-name">${esc(color.name)}</span>` : ''}
        ${showCode && color.code ? `<span class="swatch-code">${esc(color.code)}</span>` : ''}
      </span>
    </div>
  `;
};

/**
 * Icon (CSS mask-based)
 */
export const icon = (name, opts = {}) => {
  const {
    size, className, label, ...rest
  } = opts;
  const classes = cx('icon', `icon-${name}`, size && `icon-${size}`, className);
  const a11y = label ? `aria-label="${esc(label)}"` : 'aria-hidden="true"';
  return `<span class="${classes}" ${a11y} ${attrs(rest)}></span>`;
};
