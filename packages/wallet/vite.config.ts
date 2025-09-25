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
          'hooks/index': './src/hooks/index.ts',
          'constants/index': './src/constants/index.ts',
          'utils/index': './src/utils/index.ts',
          'providers/index': './src/providers/index.tsx',
          'connectors/index': './src/connectors/index.ts',
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
          // Preserve type assertions in the output
          interop: 'auto',
        },
        plugins: [preserveDirectives({ suppressPreserveModulesWarning: true })],
      },
    },

    plugins: [
      react({
        tsDecorators: true,
      }),
    ],
    esbuild: {
      // Keep type assertions that are needed at runtime
      keepNames: true,
      target: 'es2020',
    },

    test: {
      environment: 'happy-dom',
    },
  }
})
