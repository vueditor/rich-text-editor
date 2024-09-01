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
  autocomplete: {
    templates: [
      'rotate-x-<deg>',
    ],
  },
})
