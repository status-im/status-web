/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import pkg from './package.json'

const external = [
  '@tamagui/core', // used for types
  // ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: 'index.ts',
        formats: ['es', 'cjs'],
      },
      sourcemap: true,
      emptyOutDir: mode === 'production',
      rollupOptions: {
        external,
      },
    },

    plugins: [react()],

    test: {
      environment: 'happy-dom',
    },
  }
})
