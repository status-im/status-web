import {
  createSiweAuthHandlers,
  getQuota as getKarmaQuota,
  KarmaApiClient,
} from '@status-im/karma-sdk'

import { clientEnv } from './env.client.mjs'

import type { SIWEConfig } from 'connectkit'

// API configuration
const API_BASE_URL = clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL

export const NONCE_REFETCH_INTERVAL = 300000
export const SESSION_REFETCH_INTERVAL = 300000 // 30 seconds

const apiClient = new KarmaApiClient({ baseUrl: API_BASE_URL })

export const siweConfig: SIWEConfig = {
  getNonce: async () => {
    return Math.random().toString(36).substring(2, 15)
  },

  createMessage: async () => {
    const payload = { timestamp: Math.floor(Date.now() / 1000) }
    return window.btoa(JSON.stringify(payload))
  },

  ...createSiweAuthHandlers(apiClient, {
    onAuthenticated: async () => {
      // Import dynamically to avoid circular dependencies
      const { invalidateCurrentUser } = await import('~hooks/useCurrentUser')
      invalidateCurrentUser()
    },
    onSignedOut: async () => {
      // Import dynamically to avoid circular dependencies
      const { invalidateCurrentUser } = await import('~hooks/useCurrentUser')
      invalidateCurrentUser()
    },
  }),
  nonceRefetchInterval: NONCE_REFETCH_INTERVAL,
  sessionRefetchInterval: SESSION_REFETCH_INTERVAL,
  signOutOnDisconnect: true,
  signOutOnAccountChange: true,
  signOutOnNetworkChange: false,
}

export const getQuota = async () => {
  try {
    return await getKarmaQuota(apiClient)
  } catch {
    return null
  }
}
