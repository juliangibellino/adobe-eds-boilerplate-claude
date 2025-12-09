import colorCart from '../../scripts/stores/color-cart.js';

export default function decorate(block) {
  const badge = document.createElement('span');
  badge.className = 'cart-badge';
  badge.setAttribute('aria-live', 'polite');
  block.appendChild(badge);

  // Subscribe to cart - auto-updates across tabs
  colorCart.subscribe((state) => {
    const count = state.colors.length;
    badge.textContent = count || '';
    badge.hidden = count === 0;
    badge.setAttribute('aria-label', `${count} colors saved`);
  });
}
