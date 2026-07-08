import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

const resolvePath = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '~components': resolvePath('./src/app/_components'),
      '~hooks': resolvePath('./src/app/_hooks'),
      '~website': resolvePath('./src/app/(website)'),
      '~sharing': resolvePath('./src/app/(sharing)'),
      '~admin': resolvePath('./src/app/admin'),
      '~server': resolvePath('./src/server'),
      '~app': resolvePath('./src/app'),
      '~public': resolvePath('./public'),
      '~': resolvePath('./src'),
    },
  },
})
