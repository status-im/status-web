import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import { dependencies, peerDependencies } from './package.json'

const tamaguiConfig = {
  components: [],
  config: './src/tamagui.config.ts',
  // useReactNativeWebLite: true,
}

const external = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig(({ mode }) => {
  return {
    define: {
      TAMAGUI_TARGET: JSON.stringify('web'),
    },
    build: {
      target: 'es2020',
      lib: {
        entry: './src/index.tsx',
        fileName: 'index',
        formats: ['es', 'cjs'],
      },
      sourcemap: true,
      emptyOutDir: mode === 'production',
      rollupOptions: {
        external,
      },
    },

    plugins: [
      react({
        // jsxRuntime: 'classic',
      }),
      tamaguiPlugin(tamaguiConfig),
      // tamaguiExtractPlugin(tamaguiConfig)
    ],

    test: {
      environment: 'happy-dom',
    },
  }
})
