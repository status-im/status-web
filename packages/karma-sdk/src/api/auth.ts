import type { CurrentUser, QuotaResponse, SiweSession } from '../types'
import type { KarmaApiClient } from './client'

export async function verifyMessage(
  client: KarmaApiClient,
  params: { payload: string; signature: string },
): Promise<boolean> {
  try {
    await client.request('/auth/ethereum', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return true
  } catch {
    return false
  }
}

export async function getSession(
  client: KarmaApiClient,
): Promise<SiweSession | null> {
  try {
    const data = await client.request<{ result: SiweSession }>(
      '/auth/me/session',
    )
    return data.result ?? null
  } catch {
    return null
  }
}

export async function signOut(client: KarmaApiClient): Promise<boolean> {
  try {
    await client.request('/auth/logout', { method: 'POST' })
    return true
  } catch {
    return false
  }
}

export async function getCurrentUser(
  client: KarmaApiClient,
): Promise<CurrentUser> {
  const data = await client.request<{ result: CurrentUser }>('/auth/me')
  return data.result
}

export async function getQuota(client: KarmaApiClient): Promise<QuotaResponse> {
  const data = await client.request<{ result: QuotaResponse }>('/auth/me/quota')
  return data.result
}

export function createSiweAuthHandlers(
  client: KarmaApiClient,
  options?: { onAuthenticated?: () => void; onSignedOut?: () => void },
) {
  return {
    verifyMessage: async (params: { message: string; signature: string }) => {
      const ok = await verifyMessage(client, {
        payload: params.message,
        signature: params.signature,
      })
      if (ok) options?.onAuthenticated?.()
      return ok
    },
    getSession: async () => getSession(client),
    signOut: async () => {
      const ok = await signOut(client)
      if (ok) options?.onSignedOut?.()
      return ok
    },
  }
}
