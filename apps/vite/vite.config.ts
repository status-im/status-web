import tamagui from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

const { tamaguiPlugin, tamaguiExtractPlugin } = tamagui

process.env.TAMAGUI_TARGET = 'web'
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = 1

const tamaguiConfig = {
  components: ['@status-im/components'],
  config: './tamagui.config.ts'
  // useReactNativeWebLite: true,
}

// https://vitejs.dev/config
export default defineConfig({
  define: {
    TAMAGUI_TARGET: JSON.stringify('web')
  },
  plugins: [
    react(),
    tamaguiPlugin(tamaguiConfig)
    // BUG
    // tamaguiExtractPlugin(tamaguiConfig)
  ]
})
