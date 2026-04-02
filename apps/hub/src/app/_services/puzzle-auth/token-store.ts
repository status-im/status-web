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
    if (typeof localStorage === 'undefined') return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored) as Record<string, TokenData>
      for (const [key, value] of Object.entries(parsed)) {
        this.tokens.set(key, value)
      }
    } catch (error) {
      console.warn('Failed to parse stored puzzle-auth data:', error)
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return

    const obj = Object.fromEntries(this.tokens)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  }
}

export const tokenStore = new TokenStore()
