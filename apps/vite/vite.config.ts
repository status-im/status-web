import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import type { PluginOption } from 'vite'

process.env.TAMAGUI_TARGET = 'web'
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1'

const tamaguiConfig = {
  components: ['@status-im/components'],
  config: './tamagui.config.ts',
  // useReactNativeWebLite: true,
}

// https://vitejs.dev/config
export default defineConfig({
  define: {
    TAMAGUI_TARGET: JSON.stringify('web'),
  },
  plugins: [
    react(),
    tamaguiPlugin(tamaguiConfig) as PluginOption,
    // BUG
    // tamaguiExtractPlugin(tamaguiConfig)
  ],
})
