// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('@status-im/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // todo: move all to `src` directory
    // // Or if using `src` directory:
    // './src/**/*.{js,ts,jsx,tsx,mdx}',
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
