import {
  h1, text, buttonLink, stack, container,
} from '../../scripts/lib/index.js';

export default function decorate(block) {
  const [imageRow, contentRow] = [...block.children];

  const picture = imageRow?.querySelector('picture');
  const headingEl = contentRow?.querySelector('h1, h2');
  const bodyEl = contentRow?.querySelector('p:not(:has(a))');
  const ctaEl = contentRow?.querySelector('a');

  const headingText = headingEl?.textContent || '';
  const bodyText = bodyEl?.textContent || '';

  block.innerHTML = `
    <div class="hero-media">
      ${picture?.outerHTML || ''}
    </div>
    <div class="hero-content">
      ${container(
    stack(
      `
          ${headingText ? h1(headingText, { className: 'hero-title' }) : ''}
          ${bodyText ? text(bodyText, { variant: 'lead', className: 'hero-body' }) : ''}
          ${ctaEl ? buttonLink(ctaEl.textContent, ctaEl.href, { variant: 'primary', size: 'lg', className: 'hero-cta' }) : ''}
        `,
      { gap: 'lg' },
    ),
    { size: 'lg' },
  )}
    </div>
  `;
}
