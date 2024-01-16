import * as colors from '@status-im/colors'
// import { scrollbarWidth } from 'tailwind-scrollbar-utilities'
import { fontFamily } from 'tailwindcss/defaultTheme'

// import plugin from 'tailwindcss/plugin'
import { shadows } from './src/_tokens/shadows'
import { typography } from './src/_tokens/typography'

import type { Config } from 'tailwindcss'

export default {
  // prefix: 'tw-',
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
      //     mono: fontFamily.mono,
    },

    fontSize: {
      88: [
        typography[88].fontSize,
        {
          lineHeight: typography[88].lineHeight,
          letterSpacing: typography[88].letterSpacing,
        },
      ],
      13: [
        '0.8125rem',
        {
          lineHeight: '1.1375rem',
          letterSpacing: '-0.0024375rem',
        },
      ],
    },

    colors: {
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
  },

  // theme: {
  //   fontFamily: {
  //     caveat: ['var(--font-caveat)'],
  //     mono: fontFamily.mono,
  //   },

  //   // use <Text /> from @status-im/components or arbitrary values
  //   // note: https://tailwindcss.com/docs/font-size#providing-a-default-line-height for `[fontSize, { lineHeight?, letterSpacing?, fontWeight? }]`
  //   fontSize: {
  //     // note: not in design system
  //     240: [
  //       '15rem',
  //       {
  //         lineHeight: '13.25rem',
  //         letterSpacing: '-0.6rem',
  //       },
  //     ],
  //     // note: not in design system
  //     120: [
  //       '7.5rem',
  //       {
  //         lineHeight: '5.25rem',
  //         letterSpacing: '-0.1575rem',
  //       },
  //     ],
  //     88: [
  //       '5.5rem',
  //       {
  //         lineHeight: '5.25rem',
  //         letterSpacing: '-0.1155rem',
  //       },
  //     ],
  //     // note: not in design system
  //     76: [
  //       '4.75rem',
  //       {
  //         lineHeight: '4.25rem',
  //         letterSpacing: '-0.095rem',
  //       },
  //     ],
  //     64: [
  //       '4rem',
  //       {
  //         lineHeight: '4.25rem',
  //         letterSpacing: '-0.08rem',
  //       },
  //     ],
  //     // note: not in design system
  //     48: [
  //       '3rem',
  //       {
  //         lineHeight: '3.125rem',
  //         letterSpacing: '-0.06rem',
  //       },
  //     ],
  //     40: [
  //       '2.5rem',
  //       {
  //         lineHeight: '2.75rem',
  //         letterSpacing: '-0.05rem',
  //       },
  //     ],
  //     27: [
  //       '1.6875rem',
  //       {
  //         lineHeight: '2rem',
  //         letterSpacing: '-0.0354375rem',
  //       },
  //     ],
  //     19: [
  //       '1.1875rem',
  //       {
  //         lineHeight: '1.75rem',
  //         letterSpacing: '-0.019rem',
  //       },
  //     ],
  //     15: [
  //       '0.9375rem',
  //       {
  //         lineHeight: '1.359375rem',
  //         letterSpacing: '-0.0084375rem',
  //       },
  //     ],
  //     13: [
  //       '0.8125rem',
  //       {
  //         lineHeight: '1.1375rem',
  //         letterSpacing: '-0.0024375rem',
  //       },
  //     ],
  //     11: [
  //       '0.6875rem',
  //       {
  //         lineHeight: '0.97625rem',
  //         letterSpacing: '-0.0034375rem',
  //       },
  //     ],
  //   },

  //   colors: colors,

  //   fontWeight: {
  //     regular: '400',
  //     400: '400',
  //     medium: '500',
  //     500: '500',
  //     semibold: '600',
  //     600: '600',
  //     bold: '700',
  //     700: '700',
  //   },

  //   boxShadow: {
  //     1: '0px 2px 20px rgba(9, 16, 28, 0.04)',
  //     2: '0px 4px 20px rgba(9, 16, 28, 0.08)',
  //     3: '0px 8px 30px rgba(9, 16, 28, 0.12);',
  //   },

  //   extend: {
  //     spacing: {
  //       30: '7.5rem',
  //     },

  //     borderRadius: {
  //       '4xl': '2rem',
  //     },

  //     maxWidth: {
  //       page: '1504',
  //     },

  //     transitionProperty: {
  //       height: 'height',
  //     },

  //     screens,

  //     keyframes: {
  //       heightIn: {
  //         from: { height: '0' },
  //         // to: { height: 296 },
  //         to: { height: 'var(--radix-navigation-menu-viewport-height)' },
  //       },
  //       heightOut: {
  //         from: { height: 'var(--radix-navigation-menu-viewport-height)' },
  //         // from: { height: 296 },
  //         to: { height: '0' },
  //       },
  //       slide: {
  //         from: {
  //           transform: 'translateX(0)',
  //         },
  //         to: {
  //           transform: 'translateX(-100%)',
  //         },
  //       },
  //       marquee1: {
  //         '0%': { transform: 'translateX(0%)' },
  //         '100%': { transform: 'translateX(-100%)' },
  //       },
  //       explanationIn: {
  //         '0%': { opacity: '0', transform: 'scale(0.7)' },
  //         '80%': { opacity: '0.8', transform: 'scale(1.02)' },
  //         '100%': { opacity: '1', transform: 'scale(1)' },
  //       },
  //       explanationOut: {
  //         '0%': { opacity: '1', transform: 'scale(1)' },
  //         '100%': { opacity: '0', transform: 'scale(0.7)' },
  //       },
  //       explanationSlide: {
  //         '0%': {
  //           transform: 'translateY(100px)',
  //           opacity: '0',
  //         },
  //         '100%': {
  //           transform: 'translateY(0px)',
  //           opacity: '1',
  //         },
  //       },
  //       marquee2: {
  //         '0%': { transform: 'translateX(100%)' },
  //         '100%': { transform: 'translateX(0%)' },
  //       },

  //       // dialog
  //       'overlay-enter': {
  //         from: { opacity: '0' },
  //         to: { opacity: '1' },
  //       },
  //       'overlay-exit': {
  //         '0%': { opacity: '1' },
  //         '100%': { opacity: '0' },
  //       },
  //       'drawer-enter': {
  //         from: { opacity: '0', transform: 'translateY(100%)' },
  //         to: { opacity: '1', transform: 'translateY(0)' },
  //       },
  //       'drawer-exit': {
  //         from: { opacity: '1', transform: 'translateY(0)' },
  //         to: { opacity: '0', transform: 'translateY(100%)' },
  //       },
  //       'dialog-enter': {
  //         from: {
  //           opacity: '0',
  //           transform: 'translate(-50%, -48%) scale(0.96)',
  //         },
  //         to: {
  //           opacity: '1',
  //           transform: 'translate(-50%, -50%) scale(1)',
  //         },
  //       },
  //       'dialog-exit': {
  //         from: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
  //         to: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
  //       },
  //     },

  //     animation: {
  //       heightIn: 'heightIn 250ms ease',
  //       heightOut: 'heightOut 250ms ease',
  //       slide: '45s slide infinite linear',
  //       marquee1: 'marquee1 180s linear infinite',
  //       marquee2: 'marquee2 180s linear infinite',
  //       explanationIn: 'explanationIn 150ms ease',
  //       explanationOut: 'explanationIn 150ms ease reverse',
  //       explanationSlideUp: 'explanationSlide 180ms ease',
  //       explanationSlideDown: 'explanationSlide 180ms ease reverse',
  //     },
  //   },
  // },
  plugins: [
    // require('tailwindcss-animate'),
    // // add scrollbar utilities before lands in tailwindcss
    // // @see https://github.com/tailwindlabs/tailwindcss/pull/5732
    // scrollbarWidth(),
    // // scrollbarColor(),
    // // scrollbarGutter(),
    // plugin(({ addUtilities }) => {
    //   addUtilities({
    //     '.shadoww': {
    //       1: {
    //         background: 'pink',
    //       },
    //     },
    //   })
    // }),
  ],
} satisfies Config
