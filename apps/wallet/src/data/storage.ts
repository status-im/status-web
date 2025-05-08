// todo?: rename to store
import { KeyStore } from '@trustwallet/wallet-core'

// import { storage as wxtStorage } from 'wxt/storage'
// import type { WxtStorage } from '@wxt-dev/storage'
import { getWalletCore } from './wallet'

type T = KeyStore.ExtensionStorage['storage']

// class Storage implements T {
//   namespace: string
//   storage: WxtStorage

//   constructor(namespace: string, storage: WxtStorage) {
//     this.namespace = namespace
//     this.storage = storage
//   }

//   async get(
//     keys?: null | string | string[] | Record<string, unknown>,
//   ): Promise<Record<string, unknown>> {
//     console.log('keys', keys)
//     let ids: string[] = []
//     if (typeof keys === 'string') {
//       ids.push(keys)
//     } else if (keys instanceof Array) {
//       ids = ids.concat(keys)
//     }

//     const result: Record<string, unknown> = {}
//     ids.forEach(async id => {
//       console.log('id', id)
//       // result[id] = await this.storage.getItem(`local:${this.namespace}:${id}`)
//       const item = await this.storage.getItem(`local:${id}`)
//       console.log('item', item)
//       result[id] = item
//     })

//     console.log('result', result)

//     return result
//   }

//   async set(items: Record<string, unknown>): Promise<void> {
//     console.log('set:items', items)
//     Object.keys(items).forEach(async key => {
//       console.log('set:key', key)
//       // await this.storage.setItem(`local:${this.namespace}:${key}`, items[key])
//       await this.storage.setItem(`local:${key}`, items[key])
//     })

//     return Promise.resolve()
//   }

//   remove(keys: string | string[]): Promise<void> {
//     let ids: string[] = []
//     if (typeof keys === 'string') {
//       ids.push(keys)
//     }
//     ids = ids.concat(keys)
//     ids.forEach(async id => {
//       // await this.storage.removeItem(`local:${this.namespace}:${id}`)
//       await this.storage.removeItem(`local:${id}`)
//     })

//     return Promise.resolve()
//   }

//   clear() {
//     return Promise.resolve()
//   }

//   onChanged = {
//     addListener: () => {},
//     removeListener: () => {},
//     hasListener: () => false,
//     hasListeners: () => false,
//   }
// }

class Storage implements T {
  object: Record<string, unknown> = {}

  get(
    keys?: string | string[] | Record<string, unknown> | null | undefined,
  ): Promise<Record<string, unknown>> {
    let ids: string[] = []
    if (typeof keys === 'string') {
      ids.push(keys)
    } else if (keys instanceof Array) {
      ids = ids.concat(keys)
    }

    const result: Record<string, unknown> = {}
    ids.forEach(id => {
      result[id] = this.object[id]
    })
    return Promise.resolve(result)
  }

  set(items: Record<string, unknown>): Promise<void> {
    Object.keys(items).forEach(key => {
      this.object[key] = items[key]
    })
    return Promise.resolve()
  }

  remove(keys: string | string[]): Promise<void> {
    let ids: string[] = []
    if (typeof keys === 'string') {
      ids.push(keys)
    }
    ids = ids.concat(keys)
    ids.forEach(id => delete this.object[id])
    return Promise.resolve()
  }

  clear() {
    return Promise.resolve()
  }

  onChanged = {
    addListener: () => {},
    removeListener: () => {},
    hasListener: () => false,
    hasListeners: () => false,
  }
}

let keystore: KeyStore.Default | undefined

export async function getKeystore() {
  if (!keystore) {
    const walletCore = await getWalletCore()

    // const storage = new Storage('status', wxtStorage)
    const storage = new Storage()
    const extensionStorage = new KeyStore.ExtensionStorage(
      'all-wallet-ids',
      storage,
    )
    keystore = new KeyStore.Default(walletCore, extensionStorage)

    return keystore
  }

  return keystore
}

// const storage = new Storage()
// const extensionStorage = new KeyStore.ExtensionStorage(
//   'all-wallet-ids',
//   storage,
// )

// export const keyStore = new KeyStore.Default(walletCore, extensionStorage)
