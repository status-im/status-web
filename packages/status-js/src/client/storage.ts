type Unsubscribe = () => void

export interface Storage {
  getItem: <T = string>(key: string) => T | null
  setItem: (key: string, newValue: unknown) => void
  removeItem: (key: string) => void
  subscribe?: (key: string, callback: (value: unknown) => void) => Unsubscribe
}

export class LocalStorage implements Storage {
  #prefix = 'status-im:'

  #getStorageKey(key: string) {
    return `${this.#prefix}${key}`
  }

  getItem<T>(key: string): T | null {
    const value = window.localStorage.getItem(this.#getStorageKey(key))

    if (!value) {
      return null
    }

    try {
      return JSON.parse(value) as T
    } catch {
      // invalid JSON
      return null
    }
  }

  setItem(key: string, value: unknown): boolean {
    try {
      window.localStorage.setItem(
        this.#getStorageKey(key),
        JSON.stringify(value)
      )
      return true
    } catch {
      return false
    }
  }

  removeItem(key: string) {
    return window.localStorage.removeItem(this.#getStorageKey(key))
  }

  subscribe(key: string, callback: (value: unknown) => void) {
    const handler = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        callback(JSON.parse(event.newValue))
      }
    }

    window.addEventListener('storage', handler)

    return () => {
      window.removeEventListener('storage', handler)
    }
  }
}
