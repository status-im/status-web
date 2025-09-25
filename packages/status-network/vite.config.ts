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
          'config/index': './src/config/index.ts',
          'tailwind.config': './tailwind.config.ts',
          'hooks/index': './src/hooks/index.ts',
          'utils/index': './src/utils/index.ts',
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
  }
})
