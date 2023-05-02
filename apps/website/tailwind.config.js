// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('@status-im/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-inter)'],
    },
    colors,

    // use <Text /> from @status-im/components
    fontSize: {},
    fontWeight: {
      //   regular: '400',
      //   medium: '500',
      //   semibold: '600',
    },

    extend: {},
  },

  plugins: [],
}
