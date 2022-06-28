/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import { dependencies, peerDependencies } from './package.json'

const external = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
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
        entry: './src/index.tsx',
        fileName: 'index',
        formats: ['es'],
      },
      emptyOutDir: command === 'build',
      // sourcemap: true,
      target: 'es2020',

      rollupOptions: {
        external,
      },
    },

    plugins: [
      react({
        // jsxRuntime: 'classic',
      }),
    ],

    test: {
      environment: 'happy-dom',
    },
  }
})
