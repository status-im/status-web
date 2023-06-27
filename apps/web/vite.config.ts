import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

import type { PluginOption } from 'vite'

const tamaguiConfig = {
  components: ['@felicio/components'],
  config: './tamagui.config.ts',
  // useReactNativeWebLite: true,
}

// @see: https://vitejs.dev/config
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: {
      // mainFields: ['module', 'jsnext:main', 'jsnext'],
      alias: {
        '@felicio/components/hooks': path.resolve(
          '../../packages/components/hooks'
        ),
        '@felicio/components': path.resolve('../../packages/components/src'),
      },
    },
    define: {
      // @see https://github.com/tamagui/tamagui/blob/a0d5fa0d05e6988a7cfa2a5e7823f295b82bae10/packages/tamagui/src/setup.ts#LL20C1-L20C28
      global: 'globalThis',
      'process.env.TAMAGUI_TARGET': JSON.stringify(env.TAMAGUI_TARGET),
    },
    plugins: [
      react(),
      tamaguiPlugin(tamaguiConfig) as PluginOption,
      // tamaguiExtractPlugin(tamaguiConfig)
    ],
  }
})
