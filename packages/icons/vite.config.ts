/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import pkg from './package.json'

const external = [
  // ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: {
          '12': 'src/12/index.ts',
          '16': 'src/16/index.ts',
          '20': 'src/20/index.ts',
          social: 'src/social/index.ts',
          reactions: 'src/reactions/index.ts',
        },
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => `${entryName}/index.${format}.js`,
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
