import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  decorateSections,
  decorateBlocks,
} from './aem.js';

const LCP_BLOCKS = ['hero'];

/**
 * Decorates the main element
 * @param {Element} main
 */
function decorateMain(main) {
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP
 * @param {Element} doc
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Loads everything after LCP
 * @param {Element} doc
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  if (hash) {
    const element = doc.getElementById(hash.substring(1));
    if (element) element.scrollIntoView();
  }

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);

  sampleRUM('lazy');
}

/**
 * Loads everything after 3 seconds
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  import('./delayed.js');
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
