import { resolve } from 'node:path'
import { defineWxtModule } from 'wxt/modules'

export default defineWxtModule({
  setup(wxt) {
    wxt.hook('build:publicAssets', (_, assets) => {
      assets.push({
        absoluteSrc: resolve(
          'node_modules/@trustwallet/wallet-core/dist/lib/wallet-core.wasm',
        ),
        relativeDest: 'wallet-core.wasm',
      })
    })
  },
})
