// todo!: keep-alive

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.wxt/wxt.d.ts" />

import { Buffer } from 'buffer'

import { createAPI } from '../data/api'
import { encoder } from '../data/encoder'
import { getKeystore } from '../data/storage'
import { getWalletCore } from '../data/wallet'

export default defineBackground({
  type: 'module',
  persistent: true,
  // note: The background's main() function return a promise, but it must be synchronous
  // main: async function main() {
  main: function main() {
    // Polyfill
    globalThis.Buffer = Buffer

    // Encoder
    globalThis.encoder = encoder

    // Storage
    getKeystore().then(keystore => {
      globalThis.storage = keystore
    })

    // Wallet
    getWalletCore().then(walletCore => {
      globalThis.wallet = walletCore
    })

    // API
    createAPI().then(api => {
      globalThis.api = api
    })

    // debugger
  },
})
