import { clientEnv } from './env.client.mjs'

import type { SIWEConfig } from 'connectkit'

// API configuration
const API_BASE_URL = clientEnv.NEXT_PUBLIC_API_URL

const AUTH_ENDPOINTS = {
  verify: `${API_BASE_URL}/auth/ethereum`,
  session: `${API_BASE_URL}/auth/me`,
  logout: `${API_BASE_URL}/auth/logout`,
} as const

// Helper for API calls
const fetchAPI = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    credentials: 'include', // Send cookies with cross-origin requests
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
  return response
}

export const siweConfig: SIWEConfig = {
  getNonce: async () => {
    return Math.random().toString(36).substring(2, 15)
  },

  createMessage: async () => {
    const payload = { timestamp: Math.floor(Date.now() / 1000) }
    return window.btoa(JSON.stringify(payload))
  },

  verifyMessage: async ({ message, signature }) => {
    try {
      const response = await fetchAPI(AUTH_ENDPOINTS.verify, {
        method: 'POST',
        body: JSON.stringify({ payload: message, signature }),
      })
      return response.ok
    } catch {
      return false
    }
  },

  getSession: async () => {
    try {
      const response = await fetchAPI(AUTH_ENDPOINTS.session)
      if (!response.ok) return null

      const data = await response.json()
      return data.result ?? null
    } catch {
      return null
    }
  },

  signOut: async () => {
    try {
      const response = await fetchAPI(AUTH_ENDPOINTS.logout, {
        method: 'POST',
      })
      return response.ok
    } catch {
      return false
    }
  },

  signOutOnDisconnect: false,
}
