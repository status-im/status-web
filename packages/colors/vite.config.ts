/// <reference types="vitest" />

import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: format => `index.${format}.js`,
      },
      sourcemap: true,
      emptyOutDir: mode === 'production',
    },
  }
})
