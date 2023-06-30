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

    // use <Text /> from @status-im/components or arbitrary values
    fontSize: {
      88: [
        '5.5rem',
        {
          lineHeight: '5.25rem',
          letterSpacing: '-0.1155rem',
          fontWeight: '700',
        },
      ],
      64: [
        '4rem',
        {
          lineHeight: '4.25rem',
          letterSpacing: '-0.08rem',
          fontWeight: '700',
        },
      ],
      48: [
        '3rem',
        {
          lineHeight: '3.125rem',
          letterSpacing: '-0.06rem',
          fontWeight: '700',
        },
      ],
      40: [
        '2.5rem',
        {
          lineHeight: '2.75rem',
          letterSpacing: '-0.05rem',
          fontWeight: '700',
        },
      ],
      27: [
        '1.6875rem',
        {
          lineHeight: '2rem',
          letterSpacing: '-0.03544rem',
          fontWeight: '600',
        },
      ],
    },

    colors: colors,

    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    boxShadow: {
      1: '0px 2px 20px rgba(9, 16, 28, 0.04)',
      2: '0px 4px 20px rgba(9, 16, 28, 0.08)',
      3: '0px 8px 30px rgba(9, 16, 28, 0.12);',
    },

    extend: {
      spacing: {
        30: '7.5rem',
      },

      maxWidth: {
        page: 1504,
      },

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
