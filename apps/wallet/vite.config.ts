import { defineConfig } from 'vite'
import { WxtVitest } from 'wxt/testing'

export default defineConfig(() => {
  return {
    plugins: [WxtVitest()],
    test: {
      // environment: 'happy-dom',
    },
  }
})
