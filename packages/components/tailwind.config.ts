import * as colors from '@status-im/colors'
import { scrollbarWidth } from 'tailwind-scrollbar-utilities'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'
import reactAriaComponentsPlugin from 'tailwindcss-react-aria-components'

import type { Config } from 'tailwindcss'

const customisation = {
  army: {
    '50': '33 98 102',
    '60': '26 78 82',
  },
  blue: {
    '50': '42 74 245',
    '60': '34 59 196',
  },
  camel: {
    '50': '199 143 103',
    '60': '159 114 82',
  },
  copper: {
    '50': '203 98 86',
    '60': '162 78 69',
  },
  magenta: {
    '50': '236 38 108',
    '60': '189 30 86',
  },
  orange: {
    '50': '255 125 70',
    '60': '204 100 56',
  },
  pink: {
    '50': '246 111 143',
    '60': '197 89 114',
  },
  purple: {
    '50': '113 64 253',
    '60': '90 51 202',
  },
  sky: {
    '50': '25 146 215',
    '60': '20 117 172',
  },
  turquoise: {
    '50': '42 121 155',
    '60': '34 97 124',
  },
  yang: {
    '50': '255 255 255',
    '60': '235 235 235',
  },
  yellow: {
    '50': '246 176 60',
    '60': '197 141 48',
  },
  yin: {
    '50': '9 16 28',
    '60': '29 35 46',
  },
}

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
      88: ['5.5rem', { lineHeight: '5.25rem', letterSpacing: '-0.1155rem' }],
      64: ['4rem', { lineHeight: '4.25rem', letterSpacing: '-0.08rem' }],
      40: ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.05rem' }],
      27: ['1.6875rem', { lineHeight: '2rem', letterSpacing: '0rem' }],
      19: ['1.1875rem', { lineHeight: '1.75rem', letterSpacing: '0rem' }],
      15: ['0.9375rem', { lineHeight: '1.36rem', letterSpacing: '0rem' }],
      13: ['0.8125rem', { lineHeight: '1.1375rem', letterSpacing: '0rem' }],
      11: ['0.6875rem', { lineHeight: '1', letterSpacing: '0rem' }],
    },

    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      customisation: {
        ...colors.customisation,
        50: {
          DEFAULT: 'rgb(var(--customisation-50))',
          '5': 'rgb(var(--customisation-50), 0.5)',
          '10': 'rgb(var(--customisation-50), 0.1)',
          '20': 'rgb(var(--customisation-50), 0.2)',
          '30': 'rgb(var(--customisation-50), 0.3)',
          '40': 'rgb(var(--customisation-50), 0.4)',
        },
        60: 'rgb(var(--customisation-60))',
      },
    },

    boxShadow: {
      // light
      1: '0px 2px 20px 0px rgba(9, 16, 28, 0.04)',
      2: '0px 4px 20px 0px rgba(9, 16, 28, 0.08)',
      3: '0px 8px 30px 0px rgba(9, 16, 28, 0.12)',
      4: '0px 12px 56px 0px rgba(9, 16, 28, 0.16)',

      // dark
      //   1: '0px 4px 40px 0px rgba(9, 16, 28, 0.50)',
      //   2: '0px 8px 40px 0px rgba(9, 16, 28, 0.64)',
      //   3: '0px 12px 50px 0px rgba(9, 16, 28, 0.64)',
      //   4: '0px 16px 64px 0px rgba(9, 16, 28, 0.72)',
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
  },

  //   boxShadow: {
  //     1: '0px 2px 20px rgba(9, 16, 28, 0.04)',
  //     2: '0px 4px 20px rgba(9, 16, 28, 0.08)',
  //     3: '0px 8px 30px rgba(9, 16, 28, 0.12);',
  //   },

  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.theme-army': {
          '--customisation-50': customisation.army['50'],
          '--customisation-60': customisation.army['60'],
        },
        '.theme-blue': {
          '--customisation-50': customisation.blue['50'],
          '--customisation-60': customisation.blue['60'],
        },
        '.theme-camel': {
          '--customisation-50': customisation.camel['50'],
          '--customisation-60': customisation.camel['60'],
        },
        '.theme-copper': {
          '--customisation-50': customisation.copper['50'],
          '--customisation-60': customisation.copper['60'],
        },
        '.theme-magenta': {
          '--customisation-50': customisation.magenta['50'],
          '--customisation-60': customisation.magenta['60'],
        },
        '.theme-orange': {
          '--customisation-50': customisation.orange['50'],
          '--customisation-60': customisation.orange['60'],
        },
        '.theme-pink': {
          '--customisation-50': customisation.pink['50'],
          '--customisation-60': customisation.pink['60'],
        },
        '.theme-purple': {
          '--customisation-50': customisation.purple['50'],
          '--customisation-60': customisation.purple['60'],
        },
        '.theme-sky': {
          '--customisation-50': customisation.sky['50'],
          '--customisation-60': customisation.sky['60'],
        },
        '.theme-turquoise': {
          '--customisation-50': customisation.turquoise['50'],
          '--customisation-60': customisation.turquoise['60'],
        },
        '.theme-yang': {
          '--customisation-50': customisation.yang['50'],
          '--customisation-60': customisation.yang['60'],
        },
        '.theme-yellow': {
          '--customisation-50': customisation.yellow['50'],
          '--customisation-60': customisation.yellow['60'],
        },
        '.theme-yin': {
          '--customisation-50': customisation.yin['50'],
          '--customisation-60': customisation.yin['60'],
        },
      })
    }),

    // @see: https://github.com/tailwindlabs/tailwindcss/blob/0848e4ca26c0869a90818adb7337b5a463be38d0/src/corePlugins.js#L218
    plugin(({ addVariant }) => {
      const selector = '[data-background="blur"]'
      addVariant('blurry', `:is(${selector} &)`)
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
