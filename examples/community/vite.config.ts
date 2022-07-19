import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * @see https://vitejs.dev/config/ for Vite configuration
 * @see https://vitest.dev/config/ for Vitest configuration
 */
export default defineConfig({
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: [
      {
        find: '@status-im/js',
        replacement: '../../packages/status-js/src/index.ts',
      },
      { find: 'js-waku', replacement: './js-waku-mock.ts' },
      { find: /\.\/client\/client/, replacement: './client-mock.ts' },
    ],
  },
  // todo?: remove
  plugins: [react()],
  // todo: remove
  // test: {
  //   deps: {
  //     // inline: ['js-waku'],
  //     // inline: ['@status-im/react', '@status-im/js', 'js-waku'],
  //     inline: true,
  //   },
  // },
})
