import { defineConfig, presetIcons, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter',
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  shortcuts: [
    {
      btn: 'hover:bg-slate-100 transition-colors cursor-pointer inline-block hover:drop-shadow',
    },
    [/^btn-(sm|md|lg|disabled)$/, ([,size]) => {
      switch (size) {
        case 'sm': {
          return 'rounded p-1 text-sm'
        }
        case 'md': {
          return 'rounded-1.5 p-1.5 text-base'
        }
        case 'lg': {
          return 'rounded-2 p-2 text-xl'
        }
        case 'disabled': {
          return '!cursor-not-allowed  hover:!bg-transparent'
        }
      }

      return 'btn'
    }],
  ],
  autocomplete: {
    templates: ['btn'],
    shorthands: {
      btn: '(sm|md|lg|disabled)',
    },
  },
})
