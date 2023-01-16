import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import type { PluginOption } from 'vite'

const tamaguiConfig = {
  components: [],
  config: './src/tamagui.config.ts',
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
    // tamaguiExtractPlugin(tamaguiConfig)
  ],
})
