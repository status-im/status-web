/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { peerDependencies } from './package.json'

const external = [
  'tamagui',
  // ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: [
          './12/index.ts',
          './16/index.ts',
          './20/index.ts',
          './reactions/index.ts',
        ],
        fileName(format, entryName) {
          // const [name] = entryName.split('/')
          return `icons-${entryName}.${format}.js`
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
