type Unsubscribe = () => void

export interface Storage {
  getItem: <T = string>(key: string) => T | null
  setItem: (key: string, newValue: unknown) => void
  removeItem: (key: string) => void
  subscribe?: (key: string, callback: (value: string) => void) => Unsubscribe
}

export class LocalStorage implements Storage {
  #prefix = 'status'

  getItem<T>(key: string): T | null {
    const value = window.localStorage.getItem(`${this.#prefix}_${key}`)

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

  setItem(key: string, value: unknown) {
    return window.localStorage.setItem(
      `${this.#prefix}_${key}`,
      JSON.stringify(value)
    )
  }

  removeItem(key: string) {
    return window.localStorage.removeItem(`${this.#prefix}_${key}`)
  }

  // todo?: test in Node.js and maybe subscribe conditionally
  subscribe(key: string, callback: (value: any) => void) {
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
