import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  vue: true,
  formatters: {
    css: true,
  },
  ignores: ['pnpm-lock.yaml'],
  rules: {
    'no-alert': 0,
  },
})
