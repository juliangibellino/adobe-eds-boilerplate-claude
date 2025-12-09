import {
  h2, text, button, buttonLink, colorSwatch, card, stack, cluster,
  defineComponent, createComponent,
} from '../../scripts/lib/index.js';
import colorCart from '../../scripts/stores/color-cart.js';

defineComponent('color-picker', {
  defaultState: {
    filter: null,
    notification: null,
  },

  setup(c) {
    // Parse colors from EDS block content
    c.colors = [...c.el.querySelectorAll(':scope > div')]
      .map((row) => {
        const cells = [...row.querySelectorAll(':scope > div')];
        return {
          hex: cells[0]?.textContent.trim(),
          name: cells[1]?.textContent.trim(),
          code: cells[2]?.textContent.trim(),
          family: cells[3]?.textContent.trim() || 'neutral',
        };
      })
      .filter((color) => color.hex?.startsWith('#'));

    c.families = [...new Set(c.colors.map((color) => color.family))];
  },

  mounted(c) {
    // Handle swatch clicks
    c.onActivate('.swatch-interactive', (e, el) => {
      const result = colorCart.addColor({
        hex: el.dataset.hex,
        name: el.dataset.name,
      });

      if (result.success) {
        c.setState({ notification: { type: 'success', message: `${el.dataset.name} added to palette` } });
        // Micro-animation
        el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], {
          duration: 300,
          easing: 'ease-out',
        });
      } else {
        const msg = result.reason === 'duplicate' ? 'Color already saved' : 'Palette full (max 20)';
        c.setState({ notification: { type: 'warning', message: msg } });
      }

      setTimeout(() => c.setState({ notification: null }), 3000);
    });

    // Handle filter buttons
    c.on('click', '.filter-btn', (e, el) => {
      c.setState({ filter: el.dataset.family || null });
    });

    // Re-render when cart changes
    c.subscribe(colorCart, () => c.render());
  },

  render(c) {
    const { filter, notification } = c.state;
    const filtered = filter ? c.colors.filter((x) => x.family === filter) : c.colors;

    return card(
      stack(
        `
        ${h2('Choose Your Colors')}
        ${text('Click any color to save it to your palette', { variant: 'caption' })}

        ${cluster(
    [
      button('All', {
        variant: filter === null ? 'primary' : 'ghost',
        size: 'sm',
        className: 'filter-btn',
        'data-family': '',
      }),
      ...c.families.map((f) => button(f, {
        variant: filter === f ? 'primary' : 'ghost',
        size: 'sm',
        className: 'filter-btn',
        'data-family': f,
      })),
    ].join(''),
    { gap: 'sm', className: 'color-picker-filters' },
  )}

        ${notification ? `<div class="notification notification-${notification.type}">${notification.message}</div>` : ''}

        <div class="color-picker-grid">
          ${filtered
    .map((color) => colorSwatch(color, {
      interactive: true,
      selected: colorCart.hasColor(color.hex),
      showCode: true,
    }))
    .join('')}
        </div>

        ${cluster(
    `
          <span class="color-picker-count">${colorCart.count} colors saved</span>
          ${buttonLink('View Palette', '/palette', { variant: 'secondary' })}
        `,
    { justify: 'between', className: 'color-picker-footer' },
  )}
      `,
        { gap: 'lg' },
      ),
      { padding: 'lg' },
    );
  },
});

export default function decorate(block) {
  createComponent('color-picker', block);
}
