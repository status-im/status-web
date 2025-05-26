import { KeyStore } from '@trustwallet/wallet-core'

import { Storage } from './storage'
import { getWalletCore } from './wallet'

let keystore: KeyStore.Default | undefined

export async function getKeystore() {
  if (!keystore) {
    const walletCore = await getWalletCore()

    const storage = new Storage('status')
    const extensionStorage = new KeyStore.ExtensionStorage(
      'all-wallet-ids',
      storage,
    )
    keystore = new KeyStore.Default(walletCore, extensionStorage)

    return keystore
  }

  return keystore
}
