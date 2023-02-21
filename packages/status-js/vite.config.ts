/// <reference types="vitest" />

import { defineConfig } from 'vite'

import { dependencies } from './package.json'

import type { Alias } from 'vite'

const external = [
  ...Object.keys(dependencies || {}),
  // ...Object.keys(peerDependencies || {}),
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig(({ mode }) => {
  const alias: Alias[] = []

  if (process.env.VITE_NODE === 'true' || mode === 'test') {
    alias.push({
      /**
       * Note: `happy-dom` nor `jsdom` have Crypto implemented (@see https://github.com/jsdom/jsdom/issues/1612)
       */
      find: /^.*\/crypto\/pbkdf2.browser$/,
      replacement: 'ethereum-cryptography/pbkdf2',
    })
  }

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
    resolve: {
      alias,
    },
    test: {
      environment: 'happy-dom',
    },
  }
})
