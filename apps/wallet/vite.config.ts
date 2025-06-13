import { defineConfig } from 'vite'
import { WxtVitest } from 'wxt/testing'

export default defineConfig(() => {
  return {
    plugins: [WxtVitest()],
    test: {
      // environment: 'happy-dom',
    },
    // optimise bundle size by removing unused wordlists
    resolve: {
      alias: {
        'bip39/wordlists/chinese_simplified.json': 'node_modules/empty-module',
        'bip39/wordlists/chinese_traditional.json': 'node_modules/empty-module',
        'bip39/wordlists/french.json': 'node_modules/empty-module',
        'bip39/wordlists/italian.json': 'node_modules/empty-module',
        'bip39/wordlists/japanese.json': 'node_modules/empty-module',
        'bip39/wordlists/korean.json': 'node_modules/empty-module',
        'bip39/wordlists/spanish.json': 'node_modules/empty-module',
      },
    },
  }
})
