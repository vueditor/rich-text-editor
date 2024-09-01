import { definePreset } from 'unocss'
import { colors } from '@unocss/preset-mini'

export default definePreset(() => {
  return {
    name: 'theme',
    theme: {
      colors: {
        light: {
          text: {
            soft: colors.neutral['600'],
            base: colors.neutral['800'],
            strong: colors.neutral['950'],
            primary: colors.blue['600'],
          },
          bg: {
            soft: colors.gray['200'],
            base: colors.gray['100'],
            strong: colors.gray['50'],
            primary: colors.blue['600'],
          },
          border: {
            base: colors.stone['300'],
          },
          state: {
            hover: {
              soft: colors.zinc['300'],
              base: colors.zinc['100'],
              strong: colors.zinc['200'],
              primary: colors.blue['700'],
            },
          },
        },
        dark: {
          text: {
            soft: colors.neutral['200'],
            base: colors.neutral['100'],
            strong: colors.neutral['50'],
            primary: colors.blue['500'],
          },
          bg: {
            soft: colors.gray['700'],
            base: colors.gray['800'],
            strong: colors.gray['900'],
            primary: colors.blue['500'],
          },
          border: {
            base: colors.stone['700'],
          },
          state: {
            hover: {
              soft: colors.zinc['600'],
              base: colors.zinc['500'],
              strong: colors.zinc['400'],
              primary: colors.blue['400'],
            },
          },
        },
      },
    },
    shortcuts: [
      [
        /^text-color-(soft|base|strong|primary)$/,
        ([,degree]) => `text-light-text-${degree} dark:text-dark-text-${degree}`,
      ],
      [
        /^bg-color-(soft|base|strong|primary)$/,
        ([,degree]) => `bg-light-bg-${degree} dark:bg-dark-bg-${degree}`,
      ],
      [
        /^bg-color-hover-(soft|base|strong|primary)$/,
        ([,degree]) => `bg-light-state-hover-${degree} dark:bg-dark-state-hover-${degree}`,
      ],
      [
        /^border-color-(base)$/,
        ([,degree]) => `border-light-border-${degree} dark:border-dark-border-${degree}`,
      ],
    ],
    autocomplete: {
      templates: [
        '<theme>-text-<degree>',
        'text-color-<degree>',
        'bg-color-<degree>',
        'bg-color-hover-<degree>',
        'border-color-base',
      ],
      shorthands: {
        theme: '(light|dark)',
        degree: '(soft|base|strong|primary)',
      },
    },
  }
})
