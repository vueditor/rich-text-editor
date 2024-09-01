import { defineConfig, presetIcons, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'
import theme from './src/unocss/theme'

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
    theme(),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  rules: [
    [/^rotate-x-(\d+)$/, ([,d]) => ({
      transform: `rotateX(${d}deg)`,
    })],
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
      'divider-(x|y)',
    ],
  },
})
