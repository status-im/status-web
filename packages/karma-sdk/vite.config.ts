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
          'src/index': './src/index.ts',
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
        output: {
          preserveModules: true,
        },
      },
    },

    test: {
      environment: 'happy-dom',
    },
  }
})
