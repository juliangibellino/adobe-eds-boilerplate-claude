import {
  link, buttonLink, cluster, container,
} from '../../scripts/lib/index.js';

function renderFallbackHeader() {
  return `
    <nav id="nav" class="nav-fallback">
      ${container(
    cluster(
      `
          <a href="/" class="nav-brand-link">
            <strong>BEHR</strong>
          </a>
          <div class="nav-links">
            ${link('Colors', '/colors', { className: 'nav-link' })}
            ${link('Products', '/products', { className: 'nav-link' })}
            ${link('Inspiration', '/inspiration', { className: 'nav-link' })}
          </div>
          ${buttonLink('Find a Store', '/stores', { variant: 'primary', size: 'sm' })}
        `,
      { justify: 'between', className: 'nav-inner' },
    ),
  )}
    </nav>
  `;
}

/**
 * Loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Fetch nav content
  const navMeta = document.querySelector('meta[name="nav"]');
  const navPath = navMeta ? navMeta.content : '/nav';

  const resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) {
    block.innerHTML = renderFallbackHeader();
    return;
  }

  const html = await resp.text();
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = html;

  // Process nav sections
  const sections = nav.querySelectorAll(':scope > div');
  if (sections.length > 0) {
    // Brand/logo section
    const brandSection = sections[0];
    brandSection.classList.add('nav-brand');

    // Navigation links section
    if (sections[1]) {
      sections[1].classList.add('nav-links');
      const links = sections[1].querySelectorAll('a');
      links.forEach((a) => a.classList.add('nav-link'));
    }

    // CTA section
    if (sections[2]) {
      sections[2].classList.add('nav-cta');
      const cta = sections[2].querySelector('a');
      if (cta) {
        cta.classList.add('btn', 'btn-primary', 'btn-sm');
      }
    }
  }

  // Mobile menu toggle
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = `
    <span class="nav-hamburger-icon"></span>
  `;

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('nav-open');
  });

  block.innerHTML = '';
  block.append(hamburger);
  block.append(nav);
}
