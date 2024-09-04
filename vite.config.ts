import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig({
  plugins: [
    VueDevTools(),
    vue(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        {
          destr: ['destr'],
        },
      ],
      dts: true,
      dirs: ['./src/composables', './src/utils'],
    }),
    Components({
      dirs: ['./src/components', './src/editor'],
      extensions: ['vue'],
      deep: true,
      directoryAsNamespace: false,
    }),
    UnoCSS(),
    analyzer({
      analyzerMode: 'static',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vueuse': ['@vueuse/core'],
          'gsap': ['gsap'],
          'fflate': ['fflate'],
          'floating-ui': ['@floating-ui/dom'],
          'prosemirror-model': ['@tiptap/pm/model'],
          'prosemirror-transform': ['@tiptap/pm/transform'],
          'prosemirror-view': ['@tiptap/pm/view'],
          'tiptap': ['@tiptap/vue-3'],
        },
      },
    },
  },
})
