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
        entry: [
          './src/index.ts',
          './src/utils/encode-url-data.ts',
          './src/utils/create-url.ts',
        ],
        fileName: (format, entryName) => {
          if (!['es'].includes(format)) {
            throw new Error(`Unexpected format: ${format}`)
          }

          switch (format) {
            case 'es':
              return `${entryName}.js`
            default:
              throw new Error(`Undefined format: ${format}`)
          }
        },
        formats: ['es'],
      },
      sourcemap: true,
      emptyOutDir: mode === 'production',
      rollupOptions: {
        external: [...external, 'zlib'],
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
