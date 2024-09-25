import * as colors from '@status-im/colors'
import { scrollbarWidth } from 'tailwind-scrollbar-utilities'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'
import reactAriaComponentsPlugin from 'tailwindcss-react-aria-components'

import type { Config } from 'tailwindcss'

export default {
  darkMode: ['selector', '[data-theme="dark"]'],

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
      88: ['5.5rem', { lineHeight: '5.25rem', letterSpacing: '-0.1155rem' }],
      64: ['4rem', { lineHeight: '4.25rem', letterSpacing: '-0.08rem' }],
      40: ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.05rem' }],
      27: ['1.6875rem', { lineHeight: '2rem', letterSpacing: '0rem' }],
      19: ['1.1875rem', { lineHeight: '1.75rem', letterSpacing: '0rem' }],
      15: ['0.9375rem', { lineHeight: '1.36rem', letterSpacing: '0rem' }],
      13: ['0.8125rem', { lineHeight: '1.1375rem', letterSpacing: '0rem' }],
      11: ['0.6875rem', { lineHeight: '1', letterSpacing: '0rem' }],
    },

    opacity: {},

    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      customisation: {
        ...colors.customisation,
        '50': 'var(--customisation-50)',
        '50/5': 'var(--customisation-50-5)',
        '50/10': 'var(--customisation-50-10)',
        '50/20': 'var(--customisation-50-20)',
        '50/30': 'var(--customisation-50-30)',
        '50/40': 'var(--customisation-50-40)',
        '60': 'var(--customisation-60)',
      },
    },

    boxShadow: {
      1: 'var(--shadow-1, 0px 2px 20px 0px rgba(9, 16, 28, 0.04))',
      2: 'var(--shadow-2, 0px 4px 20px 0px rgba(9, 16, 28, 0.08))',
      3: 'var(--shadow-3, 0px 8px 30px 0px rgba(9, 16, 28, 0.12))',
      4: 'var(--shadow-4, 0px 12px 56px 0px rgba(9, 16, 28, 0.16))',
    },

    borderRadius: {
      // none: '0',
      0: '0',
      // 2: '4px',
      // 3: '6px',
      // 4: '8px',
      // 5: '10px',
      // 6: '12px',
      // 7: '16px',
      // 8: '20px',
      // full: '9999px',

      4: '4px',
      6: '6px',
      8: '8px',
      10: '10px',
      12: '12px',
      16: '16px',
      20: '20px',
      full: '9999px',
    },

    keyframes: {
      skeleton: {
        '0%, 100%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
      },
    },
    animation: {
      skeleton: 'skeleton 1.5s ease infinite',
    },
  },

  plugins: [
    plugin(({ addBase }) => {
      addBase({
        // '[data-theme="light"]': {},
        '[data-theme="dark"]': {
          '--shadow-1': '0px 4px 40px 0px rgba(9, 16, 28, 0.50)',
          '--shadow-2': '0px 8px 40px 0px rgba(9, 16, 28, 0.64)',
          '--shadow-3': '0px 12px 50px 0px rgba(9, 16, 28, 0.64)',
          '--shadow-4': '0px 16px 64px 0px rgba(9, 16, 28, 0.72)',
        },

        '[data-customisation="army"]': {
          '--customisation-50': colors.customisation.army['50'],
          '--customisation-50-5': colors.customisation.army['50/5'],
          '--customisation-50-10': colors.customisation.army['50/10'],
          '--customisation-50-20': colors.customisation.army['50/20'],
          '--customisation-50-30': colors.customisation.army['50/30'],
          '--customisation-50-40': colors.customisation.army['50/40'],
          '--customisation-60': colors.customisation.army['60'],
        },
        '[data-customisation="blue"]': {
          '--customisation-50': colors.customisation.blue['50'],
          '--customisation-50-5': colors.customisation.blue['50/5'],
          '--customisation-50-10': colors.customisation.blue['50/10'],
          '--customisation-50-20': colors.customisation.blue['50/20'],
          '--customisation-50-30': colors.customisation.blue['50/30'],
          '--customisation-50-40': colors.customisation.blue['50/40'],
          '--customisation-60': colors.customisation.blue['60'],
        },
        '[data-customisation="camel"]': {
          '--customisation-50': colors.customisation.camel['50'],
          '--customisation-50-5': colors.customisation.camel['50/5'],
          '--customisation-50-10': colors.customisation.camel['50/10'],
          '--customisation-50-20': colors.customisation.camel['50/20'],
          '--customisation-50-30': colors.customisation.camel['50/30'],
          '--customisation-50-40': colors.customisation.camel['50/40'],
          '--customisation-60': colors.customisation.camel['60'],
        },
        '[data-customisation="copper"]': {
          '--customisation-50': colors.customisation.copper['50'],
          '--customisation-50-5': colors.customisation.copper['50/5'],
          '--customisation-50-10': colors.customisation.copper['50/10'],
          '--customisation-50-20': colors.customisation.copper['50/20'],
          '--customisation-50-30': colors.customisation.copper['50/30'],
          '--customisation-50-40': colors.customisation.copper['50/40'],
          '--customisation-60': colors.customisation.copper['60'],
        },
        '[data-customisation="magenta"]': {
          '--customisation-50': colors.customisation.magenta['50'],
          '--customisation-50-5': colors.customisation.magenta['50/5'],
          '--customisation-50-10': colors.customisation.magenta['50/10'],
          '--customisation-50-20': colors.customisation.magenta['50/20'],
          '--customisation-50-30': colors.customisation.magenta['50/30'],
          '--customisation-50-40': colors.customisation.magenta['50/40'],
          '--customisation-60': colors.customisation.magenta['60'],
        },
        '[data-customisation="orange"]': {
          '--customisation-50': colors.customisation.orange['50'],
          '--customisation-50-5': colors.customisation.orange['50/5'],
          '--customisation-50-10': colors.customisation.orange['50/10'],
          '--customisation-50-20': colors.customisation.orange['50/20'],
          '--customisation-50-30': colors.customisation.orange['50/30'],
          '--customisation-50-40': colors.customisation.orange['50/40'],
          '--customisation-60': colors.customisation.orange['60'],
        },
        '[data-customisation="pink"]': {
          '--customisation-50': colors.customisation.pink['50'],
          '--customisation-50-5': colors.customisation.pink['50/5'],
          '--customisation-50-10': colors.customisation.pink['50/10'],
          '--customisation-50-20': colors.customisation.pink['50/20'],
          '--customisation-50-30': colors.customisation.pink['50/30'],
          '--customisation-50-40': colors.customisation.pink['50/40'],
          '--customisation-60': colors.customisation.pink['60'],
        },
        '[data-customisation="purple"]': {
          '--customisation-50': colors.customisation.purple['50'],
          '--customisation-50-5': colors.customisation.purple['50/5'],
          '--customisation-50-10': colors.customisation.purple['50/10'],
          '--customisation-50-20': colors.customisation.purple['50/20'],
          '--customisation-50-30': colors.customisation.purple['50/30'],
          '--customisation-50-40': colors.customisation.purple['50/40'],
          '--customisation-60': colors.customisation.purple['60'],
        },
        '[data-customisation="sky"]': {
          '--customisation-50': colors.customisation.sky['50'],
          '--customisation-50-5': colors.customisation.sky['50/5'],
          '--customisation-50-10': colors.customisation.sky['50/10'],
          '--customisation-50-20': colors.customisation.sky['50/20'],
          '--customisation-50-30': colors.customisation.sky['50/30'],
          '--customisation-50-40': colors.customisation.sky['50/40'],
          '--customisation-60': colors.customisation.sky['60'],
        },
        '[data-customisation="turquoise"]': {
          '--customisation-50': colors.customisation.turquoise['50'],
          '--customisation-50-5': colors.customisation.turquoise['50/5'],
          '--customisation-50-10': colors.customisation.turquoise['50/10'],
          '--customisation-50-20': colors.customisation.turquoise['50/20'],
          '--customisation-50-30': colors.customisation.turquoise['50/30'],
          '--customisation-50-40': colors.customisation.turquoise['50/40'],
          '--customisation-60': colors.customisation.turquoise['60'],
        },
        '[data-customisation="yang"]': {
          '--customisation-50': colors.customisation.yang['50'],
          '--customisation-50-5': colors.customisation.yang['50/5'],
          '--customisation-50-10': colors.customisation.yang['50/10'],
          '--customisation-50-20': colors.customisation.yang['50/20'],
          '--customisation-50-30': colors.customisation.yang['50/30'],
          '--customisation-50-40': colors.customisation.yang['50/40'],
          '--customisation-60': colors.customisation.yang['60'],
        },
        '[data-customisation="yellow"]': {
          '--customisation-50': colors.customisation.yellow['50'],
          '--customisation-50-5': colors.customisation.yellow['50/5'],
          '--customisation-50-10': colors.customisation.yellow['50/10'],
          '--customisation-50-20': colors.customisation.yellow['50/20'],
          '--customisation-50-30': colors.customisation.yellow['50/30'],
          '--customisation-50-40': colors.customisation.yellow['50/40'],
          '--customisation-60': colors.customisation.yellow['60'],
        },
        '[data-customisation="yin"]': {
          '--customisation-50': colors.customisation.yin['50'],
          '--customisation-50-5': colors.customisation.yin['50/5'],
          '--customisation-50-10': colors.customisation.yin['50/10'],
          '--customisation-50-20': colors.customisation.yin['50/20'],
          '--customisation-50-30': colors.customisation.yin['50/30'],
          '--customisation-50-40': colors.customisation.yin['50/40'],
          '--customisation-60': colors.customisation.yin['60'],
        },
      })
    }),

    // @see: https://github.com/tailwindlabs/tailwindcss/blob/0848e4ca26c0869a90818adb7337b5a463be38d0/src/corePlugins.js#L218
    plugin(({ addVariant }) => {
      const selector = '[data-background="blur"]'
      // addVariant('blur', `:is(${selector} &)`)
      addVariant('blur', `&:where(${selector}, ${selector} *)`)
    }),

    reactAriaComponentsPlugin,
    // require('tailwindcss-animate'),
    // // add scrollbar utilities before lands in tailwindcss
    // // @see https://github.com/tailwindlabs/tailwindcss/pull/5732
    scrollbarWidth(),
    // // scrollbarColor(),
    // // scrollbarGutter(),
  ],
} satisfies Config
