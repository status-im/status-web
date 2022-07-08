/// <reference types="vitest" />

import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

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
      coverage: {
        all: true,
        include: ['src/**'],
        exclude: [
          ...configDefaults.coverage.exclude!,
          '.scripts/*',
          'src/proto/**',
          'src/protos/**',
          'src/index.ts',
        ],
        reporter: ['text', 'html'],
      },
    },
  }
})
