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

export async function GET(): Promise<Response> {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const authUrl = await keycloak.createAuthorizationURL(
    state,
    codeVerifier,
    `${getBaseUrl()}/login/keycloak/callback`
  )

  ;(await cookies()).set(KEYCLOAK_STATE_COOKIE_NAME, state, {
    path: '/',
    secure: serverEnv.VERCEL_ENV !== 'development',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })
  ;(await cookies()).set(KEYCLOAK_VERIFIER_COOKIE_NAME, codeVerifier, {
    path: '/',
    secure: serverEnv.VERCEL_ENV !== 'development',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })

  redirect(authUrl.toString())
}
