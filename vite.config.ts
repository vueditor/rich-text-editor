import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    VueDevTools(),
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dts: true,
      dirs: ['./src/composables', './src/utils'],
    }),
    Components({
      dirs: ['./src/components'],
      extensions: ['vue'],
      deep: true,
      directoryAsNamespace: false,
    }),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
