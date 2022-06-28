/// <reference types="vitest" />

import { defineConfig } from 'vite'

import { dependencies } from './package.json'

const external = [
  ...Object.keys(dependencies || {}),
  // ...Object.keys(peerDependencies || {}),
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: './src/index.ts',
        fileName: 'index',
        formats: ['es'],
      },
      sourcemap: true,
      emptyOutDir: mode === 'production',
      rollupOptions: {
        external,
      },
    },

    test: {
      // environment: 'happy-dom',
    },
  }
})
