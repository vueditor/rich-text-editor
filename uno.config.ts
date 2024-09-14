import { defineConfig, presetIcons, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter',
        mono: 'Ubuntu Mono',
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  rules: [
    [/^rotate-x-(\d+)$/, ([,d]) => ({
      transform: `rotateX(${d}deg)`,
    })],
    [
      'word-break',
      {
        'word-break': 'normal',
        'overflow-wrap': 'anywhere',
      },
    ],
    [
      'shadow-surround',
      {
        'box-shadow': '0 0 2px 2px rgb(0 0 0 /0.1)',
      },
    ],
    [
      /shadow-surround-(sm|md|lg)/,
      ([,size]) => {
        if (size === 'sm') {
          return {
            'box-shadow': '0 0 2px 1px rgb(0 0 0 /0.1)',
          }
        }
        if (size === 'md') {
          return {
            'box-shadow': '0 0 4px 2px  rgb(0 0 0 /0.1)',
          }
        }
        if (size === 'lg') {
          return {
            'box-shadow': '0 0 4px 4px rgb(0 0 0 /0.1)',
          }
        }
      },
    ],
  ],
  shortcuts: [
    [
      /^divider-(x|y)$/,
      ([,direction]) => `rounded-0.5 ${direction === 'y' ? 'w-0.5 h-full' : 'h-0.5'}`,
    ],
  ],
  autocomplete: {
    templates: [
      'rotate-x-180',
      'word-break',
      'divider-(x|y)',
      'border-surround-<size>',
    ],
    shorthands: {
      size: '(sm|md|lg)',
    },
  },
})
