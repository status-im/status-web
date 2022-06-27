/// <reference types="vitest" />

import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import { dependencies } from './package.json'

const external = [
  ...Object.keys(dependencies || {}),
  // ...Object.keys(peerDependencies || {}),
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig(({ command }) => {
  return {
    resolve: {
      alias: {
        '~': resolve('.'),
      },
    },
    build: {
      lib: {
        entry: './src/index.ts',
        fileName: 'index',
        formats: ['es'],
      },
      target: 'es2020',
      emptyOutDir: command === 'build',
      rollupOptions: {
        external,
      },
    },

    test: {
      // environment: 'happy-dom',
    },
  }
})
