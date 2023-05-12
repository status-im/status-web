import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

import type { PluginOption } from 'vite'

const tamaguiConfig = {
  components: ['@status-im/components'],
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
        '@status-im/components/hooks': path.resolve(
          '../../packages/components/hooks'
        ),
        '@status-im/components': path.resolve('../../packages/components/src'),
      },
    },
    define: {
      global: 'window',
      'process.env.TAMAGUI_TARGET': JSON.stringify(env.TAMAGUI_TARGET),
      'process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD': JSON.stringify(
        env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD
      ),
    },
    plugins: [
      react(),
      tamaguiPlugin(tamaguiConfig) as PluginOption,
      // tamaguiExtractPlugin(tamaguiConfig)
    ],
  }
})
