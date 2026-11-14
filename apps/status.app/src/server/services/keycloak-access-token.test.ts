import { exportJWK, generateKeyPair, SignJWT, UnsecuredJWT } from 'jose'
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

import { createKeycloakAccessTokenVerifier } from './keycloak-access-token'

import type { JWK, JWTPayload } from 'jose'
import type { AddressInfo } from 'node:net'

describe('Keycloak access-token verification', () => {
  let issuer: string
  let trustedKey: CryptoKey
  let attackerKey: CryptoKey
  let publicKey: JWK
  let keys: JWK[]
  let status: number
  let requests: string[]
  let verify: ReturnType<typeof createKeycloakAccessTokenVerifier>
  const clientId = 'status-web'
  const server = createServer((request, response) => {
    requests.push(request.url!)
    response.writeHead(status, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ keys }))
  })

  beforeAll(async () => {
    const trusted = await generateKeyPair('RS256')
    trustedKey = trusted.privateKey
    publicKey = {
      ...(await exportJWK(trusted.publicKey)),
      kid: 'realm-key',
      alg: 'RS256',
      use: 'sig',
    }
    attackerKey = (await generateKeyPair('RS256')).privateKey
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
    issuer = `http://127.0.0.1:${(server.address() as AddressInfo).port}/realms/status`
  })

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()))
      server.closeAllConnections()
    })
  })

  beforeEach(() => {
    keys = [publicKey]
    status = 200
    requests = []
    verify = createKeycloakAccessTokenVerifier({ issuer, clientId })
  })

  afterEach(() => vi.restoreAllMocks())

  function claims(overrides: JWTPayload = {}): JWTPayload {
    return {
      iss: issuer,
      sub: 'staff-user-id',
      aud: 'account',
      azp: clientId,
      typ: 'Bearer',
      email: 'staff@example.com',
      email_verified: true,
      exp: Math.floor(Date.now() / 1000) + 300,
      ...overrides,
    }
  }

  function sign(payload = claims(), key = trustedKey, kid = 'realm-key') {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256', kid })
      .sign(key)
  }

  it('accepts a realm-signed access token issued to this client and caches keys', async () => {
    const token = await sign()
    await expect(verify(token)).resolves.toMatchObject({
      email: 'staff@example.com',
    })
    await verify(token)
    expect(requests).toEqual(['/realms/status/protocol/openid-connect/certs'])
  })

  it('rejects a forged signature even when the attacker copies the key ID', async () => {
    await expect(verify(await sign(claims(), attackerKey))).rejects.toThrow()
  })

  it('rejects a modified email in an otherwise valid token', async () => {
    const [header, , signature] = (await sign()).split('.')
    const payload = Buffer.from(
      JSON.stringify(claims({ email: 'admin@example.com' }))
    ).toString('base64url')
    await expect(verify(`${header}.${payload}.${signature}`)).rejects.toThrow()
  })

  it('rejects unsigned tokens', async () => {
    await expect(verify(new UnsecuredJWT(claims()).encode())).rejects.toThrow()
  })

  it('rejects symmetric signatures instead of treating a public key as an HMAC secret', async () => {
    const token = await new SignJWT(claims())
      .setProtectedHeader({ alg: 'HS256', kid: 'realm-key' })
      .sign(new TextEncoder().encode(JSON.stringify(publicKey)))
    await expect(verify(token)).rejects.toThrow()
  })

  it.each([
    ['expired', { exp: 1 }],
    ['missing expiry', { exp: undefined }],
    ['invalid expiry type', { exp: 'tomorrow' }],
    ['not yet valid', { nbf: Math.floor(Date.now() / 1000) + 3600 }],
    ['wrong issuer', { iss: 'https://attacker.example/realms/status' }],
    ['missing issuer', { iss: undefined }],
    [
      'wrong client, even with matching audience',
      { azp: 'other', aud: clientId },
    ],
    ['missing client', { azp: undefined }],
    ['ID token', { typ: 'ID', aud: clientId }],
    ['missing token type', { typ: undefined }],
    ['missing email', { email: undefined }],
    ['invalid email', { email: '' }],
    ['unverified email', { email_verified: false }],
    ['missing email verification', { email_verified: undefined }],
    ['string email verification', { email_verified: 'true' }],
    ['null email verification', { email_verified: null }],
  ])('rejects %s claims signed by the trusted realm', async (_, overrides) => {
    const token = await sign(claims(overrides as JWTPayload))
    await expect(verify(token)).rejects.toThrow()
  })

  it('selects the matching key when a realm publishes multiple signing keys', async () => {
    const rotated = await generateKeyPair('RS256')
    keys.push({ ...(await exportJWK(rotated.publicKey)), kid: 'rotated-key' })
    await expect(
      verify(await sign(claims(), rotated.privateKey, 'rotated-key'))
    ).resolves.toMatchObject({ email: 'staff@example.com' })
  })

  it('rejects an unknown signing key', async () => {
    await expect(
      verify(await sign(claims(), attackerKey, 'unknown-key'))
    ).rejects.toThrow()
  })

  it('fails closed when the realm key endpoint is unavailable', async () => {
    status = 503
    await expect(verify(await sign())).rejects.toThrow()
  })

  it('recovers after a failed key fetch without restarting the verifier', async () => {
    const token = await sign()
    status = 503
    await expect(verify(token)).rejects.toThrow()
    status = 200
    await expect(verify(token)).resolves.toMatchObject({
      email: 'staff@example.com',
    })
    expect(requests).toHaveLength(2)
  })

  it('continues verifying with fresh cached keys during a key-server outage', async () => {
    const token = await sign()
    await verify(token)
    status = 503
    await expect(verify(token)).resolves.toMatchObject({
      email: 'staff@example.com',
    })
    expect(requests).toHaveLength(1)
  })

  it('refreshes cached keys after rotation once the fetch cooldown has elapsed', async () => {
    await verify(await sign())
    const rotated = await generateKeyPair('RS256')
    keys = [{ ...(await exportJWK(rotated.publicKey)), kid: 'rotated-key' }]
    const token = await sign(claims(), rotated.privateKey, 'rotated-key')
    // jose throttles unknown-key refreshes for 30 seconds after a fetch.
    await expect(verify(token)).rejects.toThrow()
    expect(requests).toHaveLength(1)
    const afterCooldown = Date.now() + 31_000
    vi.spyOn(Date, 'now').mockReturnValue(afterCooldown)
    await expect(verify(token)).resolves.toMatchObject({
      email: 'staff@example.com',
    })
    expect(requests).toHaveLength(2)
  })

  it('shares one key fetch across concurrent authentication requests', async () => {
    const token = await sign()
    const results = await Promise.all(
      Array.from({ length: 8 }, () => verify(token))
    )
    expect(results).toHaveLength(8)
    expect(requests).toHaveLength(1)
  })

  it('rejects malformed tokens', async () => {
    await expect(verify('not-a-jwt')).rejects.toThrow()
  })

  it('fails closed when runtime configuration is missing', () => {
    expect(() =>
      createKeycloakAccessTokenVerifier({ issuer: undefined, clientId })
    ).toThrow()
    expect(() =>
      createKeycloakAccessTokenVerifier({ issuer, clientId: '' })
    ).toThrow()
  })
})
