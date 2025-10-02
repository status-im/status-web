import config from '@status-im/components/config'

import type { Config } from 'tailwindcss'

export default {
  presets: [config],

  future: {
    hoverOnlyWhenSupported: true,
  },

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Collect classes from the components package
    './node_modules/@status-im/components/dist/**/*.js',
    // Collect classes from the status-network package
    './node_modules/@status-im/status-network/dist/**/*.js',
  ],

  theme: {
    /**
     * EXTEND
     */
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
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

      fontSize: {
        64: [
          '4rem',
          {
            lineHeight: '4.25rem',
            letterSpacing: '-0.08rem',
          },
        ],
        56: [
          '3.5rem',
          {
            lineHeight: '3.75rem',
            letterSpacing: '-0.07rem',
          },
        ],
        40: [
          '2.5rem',
          {
            lineHeight: '2.75rem',
            letterSpacing: '-0.08rem',
          },
        ],
        27: [
          '1.6875rem',
          {
            lineHeight: '2rem',
            letterSpacing: '-0.0354375rem',
          },
        ],
        19: [
          '1.1875rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '-0.019rem',
          },
        ],
        15: [
          '0.9375rem',
          {
            lineHeight: '1.359375rem',
            letterSpacing: '-0.0084375rem',
          },
        ],
        13: [
          '0.8125rem',
          {
            lineHeight: '1.1375rem',
            letterSpacing: '-0.024375rem',
          },
        ],
      },

      colors: {
        orange: 'rgba(255, 125, 70, 1)',
        purple: 'rgba(113, 64, 253, 1)',
        'purple-dark': 'rgba(90, 51, 202, 1)',
        'purple-transparent': 'rgba(113, 64, 253, 0.3)',
        sky: 'rgba(25, 146, 215, 1)',
        sea: 'rgba(61, 150, 165, 1)',
        yellow: 'rgba(246, 176, 60, 1)',
        'blue-50': 'rgba(42, 74, 245, 1)',
        neutral: {
          '2.5': 'rgba(250, 251, 252, 1)',
          '5': 'rgba(245, 246, 248, 1)',
          '10': 'rgba(240, 242, 245, 1)',
          '20': 'rgba(231, 234, 238, 1)',
          '30': 'rgba(220, 224, 229, 1)',
          '40': 'rgba(161, 171, 189, 1)',
          '50': 'rgba(100, 112, 132, 1)',
          '60': 'rgba(48, 61, 85, 1)',
          '70': 'rgba(32, 44, 66, 1)',
          '80': 'rgba(27, 39, 61, 1)',
          '80/5': 'rgba(27, 39, 61, 0.05)',
          '80/10': 'rgba(27, 39, 61, 0.10)',
          '80/20': 'rgba(27, 39, 61, 0.20)',
          '80/30': 'rgba(27, 39, 61, 0.30)',
          '80/40': 'rgba(27, 39, 61, 0.40)',
          '80/50': 'rgba(27, 39, 61, 0.50)',
          '80/60': 'rgba(27, 39, 61, 0.60)',
          '80/70': 'rgba(27, 39, 61, 0.70)',
          '80/90': 'rgba(27, 39, 61, 0.90)',
          '80/95': 'rgba(27, 39, 61, 0.95)',
          '90': 'rgba(19, 29, 47, 1)',
          '95': 'rgba(13, 22, 37, 1)',
          '100': 'rgba(9, 16, 28, 1)',
        },
        dark: {
          100: 'rgba(1, 1, 1, 1)',
          60: 'rgba(1, 1, 1, 0.6)',
          8: 'rgba(1, 1, 1, 0.08)',
        },
        white: {
          100: 'rgba(255, 255, 255, 1)',
          90: 'rgba(255, 255, 255, 0.9)',
          80: 'rgba(255, 255, 255, 0.8)',
          40: 'rgba(255, 255, 255, 0.4)',
          20: 'rgba(255, 255, 255, 0.2)',
          10: 'rgba(255, 255, 255, 0.10)',
          5: 'rgba(255, 255, 255, 0.05)',
        },
      },

      borderRadius: {
        0: '0px',
        6: '6px',
        8: '8px',
        10: '10px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
        28: '28px',
        32: '32px',
        40: '40px',
        42: '42px',
        full: '9999px',
      },

      boxShadow: {
        1: '0px 2px 20px rgba(9, 16, 28, 0.04)',
        2: '0px 4px 20px rgba(9, 16, 28, 0.08)',
        3: '0px 8px 30px rgba(9, 16, 28, 0.12)',
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
  },

  plugins: [],
} satisfies Config
