import { storage as wxtStorage, type WxtStorage } from '@wxt-dev/storage'

import type { KeyStore } from '@trustwallet/wallet-core'

type T = KeyStore.ExtensionStorage['storage']
type StorageKey =
  | `local:${string}`
  | `session:${string}`
  | `sync:${string}`
  | `managed:${string}`

export class Storage implements T {
  namespace: string
  storage: WxtStorage

  constructor(namespace: string) {
    this.namespace = namespace
    this.storage = wxtStorage
  }

  private getStorageKey(key: string): StorageKey {
    return `local:${this.namespace}:${key}` as StorageKey
  }

  async get(
    keys?: null | string | string[] | Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    let ids: string[] = []
    if (typeof keys === 'string') {
      ids.push(keys)
    } else if (keys instanceof Array) {
      ids = ids.concat(keys)
    }

    const result: Record<string, unknown> = {}
    await Promise.all(
      ids.map(async id => {
        const storageKey = this.getStorageKey(id)
        const item = await this.storage.getItem(storageKey)
        result[id] = item ?? undefined
      }),
    )

    return result
  }

  async set(items: Record<string, unknown>): Promise<void> {
    await Promise.all(
      Object.entries(items).map(async ([key, value]) => {
        const storageKey = this.getStorageKey(key)
        await this.storage.setItem(storageKey, value)
      }),
    )
  }

  async remove(keys: string | string[]): Promise<void> {
    let ids: string[] = []
    if (typeof keys === 'string') {
      ids.push(keys)
    } else {
      ids = ids.concat(keys)
    }

    await Promise.all(
      ids.map(async id => {
        const storageKey = this.getStorageKey(id)
        await this.storage.removeItem(storageKey)
      }),
    )
  }

  async clear(): Promise<void> {
    return Promise.reject(new Error('clear method is not supported'))
  }

  onChanged = {
    addListener: () => {},
    removeListener: () => {},
    hasListener: () => false,
    hasListeners: () => false,
  }
}
