import * as colors from '@status-im/colors'
// import { scrollbarWidth } from 'tailwind-scrollbar-utilities'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'
import reactAriaComponentsPlugin from 'tailwindcss-react-aria-components'

import { borderRadius } from './src/_tokens/border-radius'
import { shadows } from './src/_tokens/shadows'

// import { typography } from './src/_tokens/typography'
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',

  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'transparent',
      },
    },

    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
      mono: fontFamily.mono,
    },

    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    fontSize: {
      88: [
        '5.5rem',
        {
          lineHeight: '5.25rem',
          letterSpacing: '-0.1155rem',
        },
      ],
      64: [
        '4rem',
        {
          lineHeight: '4.25rem',
          letterSpacing: '-0.08rem',
        },
      ],
      40: [
        '2.5rem',
        {
          lineHeight: '2.75rem',
          letterSpacing: '-0.05rem',
        },
      ],
      27: [
        '1.6875rem',
        {
          lineHeight: '2rem',
          letterSpacing: '0rem',
        },
      ],
      19: [
        '1.1875rem',
        {
          lineHeight: '1.75rem',
          letterSpacing: '0rem',
        },
      ],
      15: [
        '0.9375rem',
        {
          lineHeight: '1.359375rem',
          letterSpacing: '0rem',
        },
      ],
      13: [
        '0.8125rem',
        {
          lineHeight: '1.1375rem',
          letterSpacing: '0rem',
        },
      ],
      11: [
        '0.6875rem',
        {
          lineHeight: '1',
          letterSpacing: '0rem',
        },
      ],
    },

    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      customisation: {
        50: 'rgb(var(--color-customisation-50))',
        60: 'rgb(var(--color-customisation-60))',
        '50/10': 'rgb(var(--color-customisation-50) / 0.1)',
      },
    },

    boxShadow: {
      ...shadows.light,
    },

    borderRadius,
  },

  //   colors: colors,

  //   boxShadow: {
  //     1: '0px 2px 20px rgba(9, 16, 28, 0.04)',
  //     2: '0px 4px 20px rgba(9, 16, 28, 0.08)',
  //     3: '0px 8px 30px rgba(9, 16, 28, 0.12);',
  //   },

  plugins: [
    // @see: https://github.com/tailwindlabs/tailwindcss/blob/0848e4ca26c0869a90818adb7337b5a463be38d0/src/corePlugins.js#L218
    plugin(({ addVariant }) => {
      const selector = '[data-background="blur"]'
      addVariant('blurry', `:is(${selector} &)`)
    }),
    reactAriaComponentsPlugin,
    // require('tailwindcss-animate'),
    // // add scrollbar utilities before lands in tailwindcss
    // // @see https://github.com/tailwindlabs/tailwindcss/pull/5732
    // scrollbarWidth(),
    // // scrollbarColor(),
    // // scrollbarGutter(),
  ],
} satisfies Config
