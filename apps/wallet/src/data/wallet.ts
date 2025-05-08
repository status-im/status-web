// @see https://github.com/trustwallet/wallet-core/tree/master/wasm/tests
// @see https://trustwallet.github.io/docc/documentation/walletcore/hdwallet

// todo?: export signer
// todo?: export key derivator
// todo?: export mnemonic generator

import { initWasm } from '@trustwallet/wallet-core'

import type { WalletCore } from '@trustwallet/wallet-core'

export type { WalletCore }

// note: top-level await is disallowed in service workers
// export const walletCore = await initWasm()

let walletCore: WalletCore | null = null

export const getWalletCore = async () => {
  if (!walletCore) {
    walletCore = await initWasm()
  }

  return walletCore
}
