import { createRemoteJWKSet, jwtVerify } from 'jose'
import { z } from 'zod'

export function createKeycloakAccessTokenVerifier(config: {
  issuer: string | undefined
  clientId: string | undefined
}) {
  const { issuer, clientId } = config
  if (!issuer || !clientId) {
    throw new Error('Keycloak issuer and client ID are required')
  }

  // Only the configured realm supplies keys, never a URL from the token.
  // Keep this resolver across requests to cache keys and support rotation.
  const jwks = createRemoteJWKSet(
    new URL(`${issuer.replace(/\/$/, '')}/protocol/openid-connect/certs`)
  )
  const claimsSchema = z.object({
    email: z.string().email(),
    email_verified: z.literal(true),
    // Keycloak access-token audiences can contain resource servers such as
    // "account". azp identifies the client that obtained this login token.
    azp: z.literal(clientId),
    typ: z.literal('Bearer'),
  })

  return async (token: string) => {
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      requiredClaims: ['exp'],
    })

    return claimsSchema.parse(payload)
  }
}
