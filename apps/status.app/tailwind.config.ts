import config from '@status-im/components/config'
import { scrollbarWidth } from 'tailwind-scrollbar-utilities'
import plugin from 'tailwindcss/plugin'

import type { Config } from 'tailwindcss'

export default {
  presets: [config],

  future: {
    hoverOnlyWhenSupported: true,
  },

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // note: collect classes from the components package
    // @see https://github.com/tailwindlabs/tailwindcss/issues/2083#issuecomment-1169688284
    './node_modules/@status-im/components/dist/**/*.js',
  ],

  theme: {
    // when updating, also update the `screens` variable in `src/app/_hooks/use-media-query.ts`
    screens: {
      // We simulate the desktop first approach by using min-width 1px above the max-width of the previous breakpoint to match the design breakpoints
      // Otherwise, we would have to use max-width approach and change the entire codebase styles
      sm: '431px',
      md: '641px',
      '2md': '768px',
      lg: '869px',
      xl: '1024px',
      '2xl': '1281px',
      '3xl': '1441px',
      // TODO to be defined by design for pro-users
      '4xl': '1601px',
    },

    /**
     * EXTEND
     */
    extend: {
      fontFamily: {
        caveat: ['var(--font-caveat)'],
      },

      fontSize: {
        240: [
          '15rem',
          {
            lineHeight: '13.25rem',
            letterSpacing: '-0.6rem',
          },
        ],
        120: [
          '7.5rem',
          {
            lineHeight: '5.25rem',
            letterSpacing: '-0.1575rem',
          },
        ],
        76: [
          '4.75rem',
          {
            lineHeight: '4.25rem',
            letterSpacing: '-0.095rem',
          },
        ],
        48: [
          '3rem',
          {
            lineHeight: '3.125rem',
            letterSpacing: '-0.06rem',
          },
        ],
      },

      fontWeight: {
        regular: '400',
        400: '400',
        medium: '500',
        500: '500',
        semibold: '600',
        600: '600',
        bold: '700',
        700: '700',
      },

      boxShadow: {
        1: '0px 2px 20px rgba(9, 16, 28, 0.04)',
        2: '0px 4px 20px rgba(9, 16, 28, 0.08)',
        3: '0px 8px 30px rgba(9, 16, 28, 0.12);',
      },

      spacing: {
        30: '7.5rem',
      },

      transitionProperty: {
        height: 'height',
      },

      keyframes: {
        heightIn: {
          from: { height: '0' },
          // to: { height: 296 },
          to: { height: 'var(--radix-navigation-menu-viewport-height)' },
        },
        heightOut: {
          from: { height: 'var(--radix-navigation-menu-viewport-height)' },
          // from: { height: 296 },
          to: { height: '0' },
        },
        slide: {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(-100%)',
          },
        },
        slideInFromBottom: {
          from: {
            transform: 'translateY(200px)',
          },
          to: {
            transform: 'translateY(0)',
          },
        },
        explanationIn: {
          '0%': { opacity: '0', transform: 'scale(0.7)' },
          '80%': { opacity: '0.8', transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        explanationOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.7)' },
        },
        explanationSlide: {
          '0%': {
            transform: 'translateY(100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0px)',
            opacity: '1',
          },
        },

        // dialog
        'overlay-enter': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'overlay-exit': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'drawer-enter': {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'drawer-exit': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(100%)' },
        },
        'dialog-enter': {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)',
          },
          to: {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
        'dialog-exit': {
          from: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
          to: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
        },

        // accordion
        'accordion-reveal': {
          from: { height: '0px', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-hide': {
          from: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1',
          },
          to: { height: '0px', opacity: '0' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },

      animation: {
        heightIn: 'heightIn 250ms ease',
        heightOut: 'heightOut 250ms ease',
        slide: '45s slide infinite linear',
        slideInFromBottom: 'slideInFromBottom 0.5s ease',
        explanationIn: 'explanationIn 150ms ease',
        explanationOut: 'explanationIn 150ms ease reverse',
        explanationSlideUp: 'explanationSlide 180ms ease',
        explanationSlideDown: 'explanationSlide 180ms ease reverse',
        'overlay-enter': 'overlay-enter 150ms ease',
        'overlay-exit': 'overlay-exit 150ms ease',
        'drawer-enter': 'drawer-enter 150ms ease',
        'drawer-exit': 'drawer-exit 150ms ease',
        'dialog-enter': 'dialog-enter 150ms ease',
        'dialog-exit': 'dialog-exit 150ms ease',
        'accordion-reveal':
          'accordion-reveal 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        'accordion-hide': 'accordion-hide 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        spin: 'spin 1s linear infinite',
      },

      backgroundImage: {
        'gradient-hatching':
          'repeating-linear-gradient(-75deg, #E7EAEE, #E7EAEE 4px, rgba(161, 171, 188, 0.2) 0px, rgba(161, 171, 188, 0.2) 6px)',
      },
    },
  },
  plugins: [
    // add scrollbar utilities before lands in tailwindcss
    // @see https://github.com/tailwindlabs/tailwindcss/pull/5732
    scrollbarWidth(),
    // scrollbarColor(),
    // scrollbarGutter(),

    // todo: remove?
    plugin(({ matchUtilities }) => {
      matchUtilities({
        perspective: value => ({
          perspective: value,
        }),
      })
    }),

    plugin(({ addVariant }) => {
      addVariant('macos', `:is([data-platform="macos"] &)`)
      addVariant('windows', `:is([data-platform="windows"] &)`)
      addVariant('linux', `:is([data-platform="linux"] &)`)
      addVariant('ios', `:is([data-platform="ios"] &)`)
      addVariant('android', `:is([data-platform="android"] &)`)
      addVariant('unknown', `:is([data-platform="unknown"] &)`)
      // addVariant('desktop', `:is([data-platform="macos"] &, [data-platform="windows"] &, [data-platform="linux"] &)`)
      // addVariant(
      //   'mobile',
      //   `:is([data-platform="ios"] | [data-platform="android"])`
      // )
    }),

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwindcss-animate'),
    // reactAriaComponentsPlugin,
  ],
} satisfies Config
