/* eslint-disable no-var */

import type { createAPI } from './src/data/api'
import type { encoder } from './src/data/encoder'
import type { getKeystore } from './src/data/storage'
import type { getWalletCore } from './src/data/wallet'

declare global {
  // todo?: limit to background script
  var api: Awaited<ReturnType<typeof createAPI>>
  var storage: Awaited<ReturnType<typeof getKeystore>>
  var wallet: Awaited<ReturnType<typeof getWalletCore>>
  var encoder: encoder
}

export {}
