import react from '@vitejs/plugin-react-swc'
import { preserveDirectives } from 'rollup-plugin-preserve-directives'
import { defineConfig } from 'vite'

import { dependencies, devDependencies, peerDependencies } from './package.json'

const external = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
  ...Object.keys(devDependencies || {}),
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: {
          'components/index': './src/components/index.tsx',
          'tailwind.config': './tailwind.config.ts',
          'data/index': './src/data/index.ts',
        },
        formats: ['es', 'cjs'],
        fileName: format => {
          return `[name].${format}.js`
        },
      },
      sourcemap: true,
      emptyOutDir: mode === 'production',
      rollupOptions: {
        external,
        // makes 'use client' directive work
        output: {
          preserveModules: true,
        },
        plugins: [preserveDirectives({ suppressPreserveModulesWarning: true })],
      },
    },

    plugins: [react()],

    test: {
      environment: 'happy-dom',
    },

    // optimise bundle size by removing unused wordlists
    resolve: {
      alias: {
        'bip39/wordlists/chinese_simplified.json': 'node_modules/empty-module',
        'bip39/wordlists/chinese_traditional.json': 'node_modules/empty-module',
        'bip39/wordlists/french.json': 'node_modules/empty-module',
        'bip39/wordlists/italian.json': 'node_modules/empty-module',
        'bip39/wordlists/japanese.json': 'node_modules/empty-module',
        'bip39/wordlists/korean.json': 'node_modules/empty-module',
        'bip39/wordlists/spanish.json': 'node_modules/empty-module',
      },
    },
  }
})
