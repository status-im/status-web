import { type KeycloakTokens } from 'arctic'
import { addDays } from 'date-fns'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { serverEnv } from '~/config/env.server.mjs'
import {
  getBaseUrl,
  keycloak,
  KEYCLOAK_ACCESS_TOKEN_COOKIE_NAME,
  KEYCLOAK_ID_TOKEN_COOKIE_NAME,
  KEYCLOAK_STATE_COOKIE_NAME,
  KEYCLOAK_VERIFIER_COOKIE_NAME,
} from '~server/services/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/*
  fixme: add some `app/login/page.tsx` to redirect users without a permission to and to display other possible errors
  instead of just returning a reponse with a status code or redirecting to `/login/keycloak` and possibly causing `ERR_TOO_MANY_REDIRECTS`
*/
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = (await cookies()).get(KEYCLOAK_STATE_COOKIE_NAME)?.value
  const storedVerifier = (await cookies()).get(
    KEYCLOAK_VERIFIER_COOKIE_NAME
  )?.value

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !storedVerifier
  ) {
    const error = new Error('Invalid state or code')
    console.error(error)

    redirect('/login/keycloak')
  }

  let tokens: KeycloakTokens
  try {
    tokens = await keycloak.validateAuthorizationCode(
      code,
      storedVerifier,
      `${await getBaseUrl()}/login/keycloak/callback`
    )
  } catch (error) {
    console.error(error)

    redirect('/login/keycloak')
  }

  const secure =
    serverEnv.NODE_ENV === 'production' &&
    serverEnv.VERCEL_ENV !== 'development'

  ;(await cookies()).set(
    KEYCLOAK_ACCESS_TOKEN_COOKIE_NAME,
    tokens.accessToken,
    {
      path: '/',
      expires: addDays(new Date(), 30),
      secure,
      httpOnly: true,
      sameSite: 'lax',
    }
  )
  ;(await cookies()).set(KEYCLOAK_ID_TOKEN_COOKIE_NAME, tokens.idToken, {
    path: '/',
    secure,
    httpOnly: true,
    sameSite: 'lax',
  })

  redirect('/admin')
}
