import {
  h3, text, buttonLink, card, stack,
} from '../../scripts/lib/index.js';

/**
 * Decorates the cards block
 * @param {Element} block The cards block element
 */
export default function decorate(block) {
  const cards = [...block.children].map((row) => {
    const cells = [...row.children];
    const picture = cells[0]?.querySelector('picture');
    const heading = cells[1]?.querySelector('h2, h3, h4')?.textContent || '';
    const body = cells[1]?.querySelector('p:not(:has(a))')?.textContent || '';
    const link = cells[1]?.querySelector('a');

    return {
      picture,
      heading,
      body,
      link,
    };
  });

  block.innerHTML = `
    <div class="cards-grid">
      ${cards
    .map(
      (c) => card(
        `
            ${c.picture ? `<div class="card-image">${c.picture.outerHTML}</div>` : ''}
            ${stack(
    `
              ${c.heading ? h3(c.heading, { className: 'card-title' }) : ''}
              ${c.body ? text(c.body, { className: 'card-body' }) : ''}
              ${c.link ? buttonLink(c.link.textContent, c.link.href, { variant: 'outline', size: 'sm' }) : ''}
            `,
    { gap: 'md', className: 'card-content' },
  )}
          `,
        { padding: 'none', className: 'cards-card' },
      ),
    )
    .join('')}
    </div>
  `;
}
