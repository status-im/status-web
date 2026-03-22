import { STORAGE_KEY } from './constants'

import type { TokenData } from './types'

class TokenStore {
  private tokens: Map<string, TokenData>

  constructor() {
    this.tokens = new Map()
    this.loadFromStorage()
  }

  getTokenData(origin: string): TokenData | null {
    return this.tokens.get(origin) ?? null
  }

  setTokenData(origin: string, data: TokenData): void {
    this.tokens.set(origin, data)
    this.saveToStorage()
  }

  clearTokenData(origin: string): void {
    this.tokens.delete(origin)
    this.saveToStorage()
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, TokenData>
        for (const [key, value] of Object.entries(parsed)) {
          this.tokens.set(key, value)
        }
      }
    } catch {
      // localStorage may not be available (SSR) or data may be corrupted
    }
  }

  private saveToStorage(): void {
    try {
      const obj = Object.fromEntries(this.tokens)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
    } catch {
      // localStorage may not be available (SSR)
    }
  }
}

export const tokenStore = new TokenStore()
