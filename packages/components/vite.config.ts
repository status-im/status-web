import react from '@vitejs/plugin-react-swc'
import { preserveDirectives } from 'rollup-plugin-preserve-directives'
import { defineConfig } from 'vite'

import { dependencies, peerDependencies } from './package.json'

const external = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
  'tailwindcss',
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: ['./src/index.tsx', './tailwind.config.ts'],
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => `${entryName}.${format}.js`,
      },
      sourcemap: true,
      emptyOutDir: mode === 'production',
      rollupOptions: {
        external,
        // makes 'use client' directive work
        output: {
          preserveModules: true,
        },
        plugins: [
          preserveDirectives({ suppressPreserveModulesWarning: true }) as any,
        ],
      },
    },

    plugins: [react()],

    test: {
      environment: 'happy-dom',
    },
  }
})
