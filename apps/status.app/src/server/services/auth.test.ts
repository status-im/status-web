import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { auth } from './auth'

const mocks = vi.hoisted(() => ({
  cookies: new Map<string, string>(),
  findFirst: vi.fn(),
  verify: vi.fn(),
  fetch: vi.fn(),
}))

vi.mock('server-only', () => ({}))
vi.mock('arctic', () => ({ Keycloak: class {} }))
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      mocks.cookies.has(name) ? { value: mocks.cookies.get(name) } : undefined,
    toString: () =>
      [...mocks.cookies].map(([name, value]) => `${name}=${value}`).join('; '),
  }),
  headers: vi.fn(),
}))
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`redirect:${url}`)
  },
}))
vi.mock('~/config/env.server.mjs', () => ({
  serverEnv: {
    KEYCLOAK_ISSUER: 'https://identity.example/realms/status',
    KEYCLOAK_CLIENT_ID: 'status-web',
    KEYCLOAK_CLIENT_SECRET: 'test-only',
  },
}))
vi.mock('~/config/site', () => ({ SITE_URL: 'https://status.example' }))
vi.mock('../db', () => ({
  db: { query: { Users: { findFirst: mocks.findFirst } } },
}))
vi.mock('./keycloak-access-token', () => ({
  createKeycloakAccessTokenVerifier: () => mocks.verify,
}))

describe('admin authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mocks.fetch)
    mocks.fetch.mockResolvedValue(new Response(null, { status: 200 }))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.cookies.clear()
    mocks.cookies.set('keycloak_access_token', 'test-token')
    mocks.cookies.set('keycloak_id_token', 'test-id-token')
    mocks.verify.mockResolvedValue({ email: 'staff@example.com' })
    mocks.findFirst.mockResolvedValue({
      email: 'staff@example.com',
      canViewInsights: true,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('looks up only the verified email and preserves the existing user permissions', async () => {
    const session = await auth()
    expect(mocks.verify).toHaveBeenCalledWith('test-token')
    const eq = vi.fn()
    mocks.findFirst.mock.calls[0][0].where({ email: 'email-column' }, { eq })
    expect(eq).toHaveBeenCalledWith('email-column', 'staff@example.com')
    expect(session.user.canViewInsights).toBe(true)
  })

  it.each(['forged signature', 'expired token', 'unavailable JWKS'])(
    'redirects on %s before querying the database',
    async reason => {
      mocks.verify.mockRejectedValue(new Error(reason))
      await expect(auth()).rejects.toThrow('redirect:/login/keycloak')
      expect(mocks.findFirst).not.toHaveBeenCalled()
      expect(mocks.fetch).not.toHaveBeenCalled()
    }
  )

  it('redirects a request without an access token before verification or user lookup', async () => {
    mocks.cookies.delete('keycloak_access_token')
    await expect(auth()).rejects.toThrow('redirect:/login/keycloak')
    expect(mocks.verify).not.toHaveBeenCalled()
    expect(mocks.findFirst).not.toHaveBeenCalled()
  })

  it.each([undefined, { email: 'staff@example.com', canViewInsights: false }])(
    'still rejects a user without admin access: %j',
    async user => {
      mocks.findFirst.mockResolvedValue(user)
      await expect(auth()).rejects.toThrow('redirect:/login/keycloak')
      expect(mocks.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/login/keycloak/invalidate',
        {
          headers: {
            cookie:
              'keycloak_access_token=test-token; keycloak_id_token=test-id-token',
          },
          cache: 'no-store',
        }
      )
    }
  )
})
