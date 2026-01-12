import { clientEnv } from './env.client.mjs'

import type { SIWEConfig } from 'connectkit'

// API configuration
const API_BASE_URL = clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL

export const NONCE_REFETCH_INTERVAL = 300000
export const SESSION_REFETCH_INTERVAL = 300000 // 30 seconds

const AUTH_ENDPOINTS = {
  verify: `${API_BASE_URL}/auth/ethereum`,
  session: `${API_BASE_URL}/auth/me/session`,
  logout: `${API_BASE_URL}/auth/logout`,
  quota: `${API_BASE_URL}/auth/me/quota`,
} as const

export { AUTH_ENDPOINTS }

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

      if (response.ok) {
        // Import dynamically to avoid circular dependencies
        const { invalidateCurrentUser } = await import('~hooks/useCurrentUser')
        invalidateCurrentUser()
      }

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

      if (response.ok) {
        // Import dynamically to avoid circular dependencies
        const { invalidateCurrentUser } = await import('~hooks/useCurrentUser')
        invalidateCurrentUser()
      }

      return response.ok
    } catch {
      return false
    }
  },
  nonceRefetchInterval: NONCE_REFETCH_INTERVAL,
  sessionRefetchInterval: SESSION_REFETCH_INTERVAL,
  signOutOnDisconnect: true,
  signOutOnAccountChange: true,
  signOutOnNetworkChange: false,
}

export const getQuota = async () => {
  try {
    const response = await fetchAPI(AUTH_ENDPOINTS.quota)
    if (!response.ok) return null

    const data = await response.json()
    console.log('Quota data:', data)
    return data.result ?? null
  } catch {
    return null
  }
}
