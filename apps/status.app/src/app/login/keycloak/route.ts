import { generateCodeVerifier, generateState } from 'arctic'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { serverEnv } from '~/config/env.server.mjs'
import {
  getBaseUrl,
  keycloak,
  KEYCLOAK_STATE_COOKIE_NAME,
  KEYCLOAK_VERIFIER_COOKIE_NAME,
} from '~server/services/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(): Promise<Response> {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const authUrl = await keycloak.createAuthorizationURL(
    state,
    codeVerifier,
    `${await getBaseUrl()}/login/keycloak/callback`
  )

  const secure =
    serverEnv.NODE_ENV === 'production' &&
    serverEnv.VERCEL_ENV !== 'development'

  ;(await cookies()).set(KEYCLOAK_STATE_COOKIE_NAME, state, {
    path: '/',
    secure,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })
  ;(await cookies()).set(KEYCLOAK_VERIFIER_COOKIE_NAME, codeVerifier, {
    path: '/',
    secure,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })

  redirect(authUrl.toString())
}
