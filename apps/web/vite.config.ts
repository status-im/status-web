import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

import type { PluginOption } from 'vite'

process.env.TAMAGUI_TARGET = 'web'
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1'

const tamaguiConfig = {
  components: ['@status-im/components'],
  config: './tamagui.config.ts',
  // useReactNativeWebLite: true,
}

// @see: https://vitejs.dev/config
export default defineConfig({
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
    __DEV__: process.env.NODE_ENV === 'development',
    TAMAGUI_TARGET: JSON.stringify('web'),
  },
  plugins: [
    react(),
    tamaguiPlugin(tamaguiConfig) as PluginOption,
    // tamaguiExtractPlugin(tamaguiConfig)
  ],
})
