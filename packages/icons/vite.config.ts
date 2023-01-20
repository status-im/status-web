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
          './src/12/index.ts',
          './src/16/index.ts',
          './src/20/index.ts',
          './src/reactions/index.ts',
        ],
        fileName(format, entryName) {
          console.log('fileName > format, entryName', format, entryName)
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
