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
  rules: [
    [/^rotate-x-(\d+)$/, ([,d]) => ({
      transform: `rotateX(${d}deg)`,
    })],
  ],
  shortcuts: [
    [
      /^divider-(x|y)$/,
      ([,direction]) => `bg-zinc-200 rounded-0.5 ${direction === 'y' ? 'w-0.5 h-full' : 'h-0.5'}`,
    ],
  ],
  autocomplete: {
    templates: [
      'rotate-x-<deg>',
      'divider-(x|y)',
    ],
  },
})
