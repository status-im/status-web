import { exportJWK, generateKeyPair, SignJWT } from 'jose'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type { GET as Callback } from '../../app/login/keycloak/callback/route'
import type { GET as Invalidate } from '../../app/login/keycloak/invalidate/route'
import type { GET as Login } from '../../app/login/keycloak/route'
import type { auth as Authenticate } from './auth'
import type { JWTPayload } from 'jose'
import type { AddressInfo } from 'node:net'

const mocks = vi.hoisted(() => ({
  cookies: new Map<string, { value: string; options?: unknown }>(),
  findFirst: vi.fn(),
  redirect: vi.fn(),
  env: {
    NODE_ENV: 'production',
    SITE_URL: 'https://status.example',
    KEYCLOAK_API_URL: '',
    KEYCLOAK_REALM: 'status',
    KEYCLOAK_ISSUER: '',
    KEYCLOAK_CLIENT_ID: 'status-web',
    KEYCLOAK_CLIENT_SECRET: 'local-test-secret',
  },
}))

vi.mock('server-only', () => ({}))
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => mocks.cookies.get(name),
    set: (name: string, value: string, options?: unknown) =>
      mocks.cookies.set(name, { value, options }),
    delete: (name: string) => mocks.cookies.delete(name),
    toString: () =>
      [...mocks.cookies]
        .map(([name, cookie]) => `${name}=${cookie.value}`)
        .join('; '),
  }),
  headers: vi.fn(),
}))
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mocks.redirect(url)
    throw new Error(`redirect:${url}`)
  },
}))
vi.mock('~/config/env.server.mjs', () => ({ serverEnv: mocks.env }))
vi.mock('~/config/site', () => ({ SITE_URL: 'https://status.example' }))
vi.mock('../db', () => ({
  db: { query: { Users: { findFirst: mocks.findFirst } } },
}))
vi.mock('~server/services/auth', () => import('./auth'))

// The OAuth client, callback/login handlers, JWT verifier and HTTP requests are
// real. Next's request context and the user database are replaced, and the
// application's self-fetch is dispatched directly to its route handler.
describe('Keycloak login and admin authentication integration', () => {
  let auth: typeof Authenticate
  let invalidate: typeof Invalidate
  let login: typeof Login
  let callback: typeof Callback
  let privateKey: CryptoKey
  let accessToken: string
  let jwks: string
  let tokenStatus: number
  let exchange: URLSearchParams | undefined
  let logoutRequest: URL | undefined
  let tokenRequests: number
  const idToken = 'local-test-id-token'
  const staff = {
    email: 'staff@example.com',
    canViewInsights: true,
    canViewKeycard: false,
    canEditReports: false,
  }
  const server = createServer(async (request, response) => {
    const url = new URL(request.url!, mocks.env.KEYCLOAK_API_URL)
    response.setHeader('Content-Type', 'application/json')
    if (url.pathname.endsWith('/certs')) {
      response.end(jwks)
    } else if (url.pathname.endsWith('/token')) {
      tokenRequests++
      let body = ''
      for await (const chunk of request) body += chunk
      exchange = new URLSearchParams(body)
      response.statusCode = tokenStatus
      response.end(
        JSON.stringify(
          tokenStatus === 200
            ? {
                access_token: accessToken,
                id_token: idToken,
                token_type: 'Bearer',
                expires_in: 300,
                refresh_token: 'local-refresh-token',
                refresh_expires_in: 1800,
              }
            : { error: 'invalid_grant' }
        )
      )
    } else if (url.pathname.endsWith('/logout')) {
      logoutRequest = url
      response.end('{}')
    } else {
      response.writeHead(404).end('{}')
    }
  })

  async function sign(overrides: JWTPayload = {}, key = privateKey) {
    return new SignJWT({
      iss: mocks.env.KEYCLOAK_ISSUER,
      azp: mocks.env.KEYCLOAK_CLIENT_ID,
      aud: 'account',
      typ: 'Bearer',
      email: staff.email,
      sub: 'staff-id',
      exp: Math.floor(Date.now() / 1000) + 300,
      ...overrides,
    })
      .setProtectedHeader({ alg: 'RS256', kid: 'realm-key' })
      .sign(key)
  }

  beforeAll(async () => {
    const pair = await generateKeyPair('RS256')
    privateKey = pair.privateKey
    jwks = JSON.stringify({
      keys: [{ ...(await exportJWK(pair.publicKey)), kid: 'realm-key' }],
    })
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
    mocks.env.KEYCLOAK_API_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
    mocks.env.KEYCLOAK_ISSUER = `${mocks.env.KEYCLOAK_API_URL}/realms/status`
    ;({ auth } = await import('./auth'))
    ;({ GET: login } = await import('../../app/login/keycloak/route'))
    ;({ GET: callback } = await import(
      '../../app/login/keycloak/callback/route'
    ))
    ;({ GET: invalidate } = await import(
      '../../app/login/keycloak/invalidate/route'
    ))
  })

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()))
      server.closeAllConnections()
    })
  })

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetch = globalThis.fetch
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      if (String(input) === `${mocks.env.SITE_URL}/login/keycloak/invalidate`) {
        return invalidate()
      }
      return fetch(input, init)
    })
    mocks.cookies.clear()
    mocks.findFirst.mockResolvedValue(staff)
    accessToken = await sign()
    tokenStatus = 200
    tokenRequests = 0
    exchange = undefined
    logoutRequest = undefined
  })

  afterEach(() => vi.restoreAllMocks())

  async function completeLogin() {
    await expect(login()).rejects.toThrow('redirect:')
    const state = mocks.cookies.get('keycloak_state')!.value
    const request = new Request(
      `${mocks.env.SITE_URL}/login/keycloak/callback?code=test-code&state=${state}`
    )
    await expect(callback(request)).rejects.toThrow('redirect:/admin')
  }

  it('completes OAuth with PKCE, stores secure cookies, and authenticates the signed access token', async () => {
    await completeLogin()
    const authorize = new URL(mocks.redirect.mock.calls[0][0])
    expect(authorize.origin).toBe(mocks.env.KEYCLOAK_API_URL)
    expect(authorize.pathname).toBe(
      '/realms/status/protocol/openid-connect/auth'
    )
    expect(authorize.searchParams.get('client_id')).toBe('status-web')
    expect(authorize.searchParams.get('code_challenge_method')).toBe('S256')
    expect(authorize.searchParams.get('code_challenge')).toBe(
      createHash('sha256')
        .update(exchange!.get('code_verifier')!)
        .digest('base64url')
    )
    expect(authorize.searchParams.get('state')).toBe(
      mocks.cookies.get('keycloak_state')!.value
    )
    expect(exchange?.get('code_verifier')).toBe(
      mocks.cookies.get('keycloak_verifier')!.value
    )
    expect(exchange?.get('redirect_uri')).toBe(
      `${mocks.env.SITE_URL}/login/keycloak/callback`
    )
    expect(exchange?.get('client_id')).toBe('status-web')
    expect(exchange?.get('client_secret')).toBe('local-test-secret')
    expect(mocks.cookies.get('keycloak_access_token')?.options).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    })
    await expect(auth()).resolves.toEqual({ user: staff, accessToken, idToken })
  })

  it.each(['canViewInsights', 'canViewKeycard', 'canEditReports'])(
    'preserves admin access for the existing %s role',
    async role => {
      await completeLogin()
      const user = { email: staff.email, [role]: true }
      mocks.findFirst.mockResolvedValue(user)
      await expect(auth()).resolves.toMatchObject({ user })
    }
  )

  it('rejects a forged token before looking up a user', async () => {
    await completeLogin()
    const attacker = await generateKeyPair('RS256')
    mocks.cookies.set('keycloak_access_token', {
      value: await sign({}, attacker.privateKey),
    })
    await expect(auth()).rejects.toThrow('redirect:/login/keycloak')
    expect(mocks.findFirst).not.toHaveBeenCalled()
    expect(logoutRequest).toBeUndefined()
  })

  it('redirects an expired token and accepts the replacement after a new OAuth login', async () => {
    await completeLogin()
    mocks.cookies.set('keycloak_access_token', {
      value: await sign({ exp: 1 }),
    })
    await expect(auth()).rejects.toThrow('redirect:/login/keycloak')
    expect(mocks.findFirst).not.toHaveBeenCalled()
    await completeLogin()
    await expect(auth()).resolves.toMatchObject({ user: staff })
  })

  it('logs out an authenticated user with no admin permissions before restarting login', async () => {
    await completeLogin()
    mocks.findFirst.mockResolvedValue({ email: staff.email })
    await expect(auth()).rejects.toThrow('redirect:/login/keycloak')
    expect(logoutRequest?.searchParams.get('id_token_hint')).toBe(idToken)
  })

  it('rechecks database permissions when an existing admin loses access', async () => {
    await completeLogin()
    await expect(auth()).resolves.toMatchObject({ user: staff })
    mocks.findFirst.mockResolvedValue({ ...staff, canViewInsights: false })
    await expect(auth()).rejects.toThrow('redirect:/login/keycloak')
    expect(mocks.findFirst).toHaveBeenCalledTimes(2)
    expect(logoutRequest?.searchParams.get('id_token_hint')).toBe(idToken)
  })

  it('rejects mismatched OAuth state before exchanging an authorization code', async () => {
    await expect(login()).rejects.toThrow('redirect:')
    await expect(
      callback(
        new Request(
          `${mocks.env.SITE_URL}/login/keycloak/callback?code=test-code&state=wrong`
        )
      )
    ).rejects.toThrow('redirect:/login/keycloak')
    expect(tokenRequests).toBe(0)
    expect(mocks.cookies.has('keycloak_access_token')).toBe(false)
  })

  it('does not create an authenticated cookie when the token exchange fails', async () => {
    tokenStatus = 400
    await expect(login()).rejects.toThrow('redirect:')
    const state = mocks.cookies.get('keycloak_state')!.value
    await expect(
      callback(
        new Request(
          `${mocks.env.SITE_URL}/login/keycloak/callback?code=test-code&state=${state}`
        )
      )
    ).rejects.toThrow('redirect:/login/keycloak')
    expect(tokenRequests).toBe(1)
    expect(mocks.cookies.has('keycloak_access_token')).toBe(false)
  })

  it('logs out through Keycloak and removes both authentication cookies', async () => {
    await completeLogin()
    await auth()
    expect((await invalidate()).status).toBe(200)
    expect(logoutRequest?.searchParams.get('id_token_hint')).toBe(idToken)
    expect(mocks.cookies.has('keycloak_access_token')).toBe(false)
    expect(mocks.cookies.has('keycloak_id_token')).toBe(false)
    await expect(auth()).rejects.toThrow('redirect:/login/keycloak')
  })
})
