// todo: see if even necessary?

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [react()],
  test: {
    deps: {
      // inline: ['@status-im/react', '@status-im/js', 'js-waku'],
      // inline: true,
    },
  },
})
