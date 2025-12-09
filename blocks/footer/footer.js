import {
  text, link, stack, cluster, container,
} from '../../scripts/lib/index.js';

function renderFallbackFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <div class="footer-content">
      ${container(
    `
        <div class="footer-grid">
          <div class="footer-column">
            <h4 class="footer-heading">Products</h4>
            ${stack(
    `
              ${link('Interior Paint', '/products/interior', { className: 'footer-link' })}
              ${link('Exterior Paint', '/products/exterior', { className: 'footer-link' })}
              ${link('Primers', '/products/primers', { className: 'footer-link' })}
              ${link('Stains', '/products/stains', { className: 'footer-link' })}
            `,
    { gap: 'sm' },
  )}
          </div>
          <div class="footer-column">
            <h4 class="footer-heading">Resources</h4>
            ${stack(
    `
              ${link('Color Trends', '/resources/trends', { className: 'footer-link' })}
              ${link('How-To Guides', '/resources/guides', { className: 'footer-link' })}
              ${link('Project Calculator', '/resources/calculator', { className: 'footer-link' })}
              ${link('FAQs', '/resources/faqs', { className: 'footer-link' })}
            `,
    { gap: 'sm' },
  )}
          </div>
          <div class="footer-column">
            <h4 class="footer-heading">Company</h4>
            ${stack(
    `
              ${link('About Us', '/about', { className: 'footer-link' })}
              ${link('Careers', '/careers', { className: 'footer-link' })}
              ${link('Contact', '/contact', { className: 'footer-link' })}
              ${link('Press', '/press', { className: 'footer-link' })}
            `,
    { gap: 'sm' },
  )}
          </div>
        </div>
        <div class="footer-legal">
          ${cluster(
    `
            ${text(`© ${currentYear} Behr Paint Company. All rights reserved.`, { variant: 'small' })}
            <div class="footer-legal-links">
              ${link('Privacy Policy', '/privacy', { className: 'footer-link' })}
              ${link('Terms of Use', '/terms', { className: 'footer-link' })}
              ${link('Accessibility', '/accessibility', { className: 'footer-link' })}
            </div>
          `,
    { justify: 'between', className: 'footer-legal-inner' },
  )}
        </div>
      `,
  )}
    </div>
  `;
}

/**
 * Loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Fetch footer content
  const footerMeta = document.querySelector('meta[name="footer"]');
  const footerPath = footerMeta ? footerMeta.content : '/footer';

  const resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) {
    block.innerHTML = renderFallbackFooter();
    return;
  }

  const html = await resp.text();
  const footer = document.createElement('div');
  footer.className = 'footer-content';
  footer.innerHTML = html;

  // Process footer sections
  const sections = footer.querySelectorAll(':scope > div');
  sections.forEach((section, index) => {
    if (index === sections.length - 1) {
      section.classList.add('footer-legal');
    } else {
      section.classList.add('footer-column');
    }

    // Style links
    section.querySelectorAll('a').forEach((a) => {
      a.classList.add('footer-link');
    });

    // Style headings
    const heading = section.querySelector('h2, h3, h4');
    if (heading) {
      heading.classList.add('footer-heading');
    }
  });

  block.innerHTML = '';
  block.appendChild(footer);
}
