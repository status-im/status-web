// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('@status-im/colors')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-inter)', ...fontFamily.sans],
    },
    colors: colors,

    // use <Text /> from @status-im/components or arbitrary values
    // fontSize: {},
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    extend: {
      transitionProperty: {
        height: 'height',
      },

      screens: {
        'md-lg': { raw: '(min-width: 868px)' },
      },

      keyframes: {
        heightIn: {
          from: { height: 0 },
          // to: { height: 296 },
          to: { height: 'var(--radix-navigation-menu-viewport-height)' },
        },
        heightOut: {
          from: { height: 'var(--radix-navigation-menu-viewport-height)' },
          // from: { height: 296 },
          to: { height: 0 },
        },
      },
    },

    animation: {
      heightIn: 'heightIn 250ms ease',
      heightOut: 'heightOut 250ms ease',
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ matchUtilities }) => {
      matchUtilities({
        perspective: value => ({
          perspective: value,
        }),
      })
    }),
  ],
}
