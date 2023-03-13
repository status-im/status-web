/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { peerDependencies } from './package.json'

const external = [
  '@tamagui/core',
  'tamagui',
  // ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
].map(name => new RegExp(`^${name}(/.*)?`))

let index = 0
const TYPES = ['12', '16', '20', 'reactions'] as const

export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: TYPES.map(type => `./${type}/index.ts`),
        fileName() {
          // return `${TYPES[index++]}.${format}.js`
          return `${TYPES[index++]}.js`
        },
        formats: ['es'],
      },
      sourcemap: true,
      emptyOutDir: mode === 'production',
      rollupOptions: {
        external,
      },
    },

    plugins: [react()],

    // plugins: [
    //   react(),
    // ],

    test: {
      environment: 'happy-dom',
    },
  }
})
