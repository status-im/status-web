// note!: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options

import 'server-only'

import { Keycloak } from 'arctic'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { parseJWT } from 'oslo/jwt'
import { z } from 'zod'

import { serverEnv } from '~/config/env.server.mjs'

import { db } from '../db'

export const KEYCLOAK_STATE_COOKIE_NAME = 'keycloak_state'
export const KEYCLOAK_VERIFIER_COOKIE_NAME = 'keycloak_verifier'
export const KEYCLOAK_ACCESS_TOKEN_COOKIE_NAME = 'keycloak_access_token'
export const KEYCLOAK_ID_TOKEN_COOKIE_NAME = 'keycloak_id_token'

export const keycloak = new Keycloak(
  serverEnv.KEYCLOAK_ISSUER,
  serverEnv.KEYCLOAK_CLIENT_ID,
  serverEnv.KEYCLOAK_CLIENT_SECRET
)

const decodedAccessTokenSchema = z.object({
  exp: z.number(),
  email: z.string(),
})

export const auth = async () => {
  /*
  todo!: use db session instead of access token in a cookie https://lucia-auth.com/basics/sessions

  "The access token itself should never be used as a replacement for sessions" https://thecopenhagenbook.com/oauth
  */
  const accessToken = (await cookies()).get(
    KEYCLOAK_ACCESS_TOKEN_COOKIE_NAME
  )?.value
  if (!accessToken) {
    redirect('/login/keycloak')
  }

  try {
    const jwt = parseJWT(accessToken)
    const decodedAccessToken = decodedAccessTokenSchema.parse(jwt?.payload)
    const user = await db.query.Users.findFirst({
      where: (Users, { eq }) => eq(Users.email, decodedAccessToken.email),
    })

    // fixme: ditto `src/app/login/keycloak/callback/route.ts` comment about redirecting to a `app/login/page.tsx`
    if (
      !user ||
      !(user.canViewInsights || user.canViewKeycard || user.canEditReports)
    ) {
      throw new Error('Not found')
    }

    const idToken = (await cookies()).get(KEYCLOAK_ID_TOKEN_COOKIE_NAME)!.value

    return {
      user,
      accessToken,
      idToken,
    }
  } catch (error) {
    console.error(error)

    const response = await fetch(
      new URL('/login/keycloak/invalidate', await getBaseUrl()).toString(),
      {
        headers: {
          cookie: (await cookies()).toString(),
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error('Invalidation failed')
    }

    redirect('/login/keycloak')
  }
}

export const invalidateSession = async (): Promise<boolean> => {
  const idToken = (await cookies()).get(KEYCLOAK_ID_TOKEN_COOKIE_NAME)?.value

  if (!idToken) {
    return false
  }

  try {
    const response = await fetch(
      `${serverEnv.KEYCLOAK_API_URL}/realms/${serverEnv.KEYCLOAK_REALM}/protocol/openid-connect/logout?id_token_hint=${idToken}`,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return false
    }
  } catch (error) {
    console.error(error)

    return false
  }

  ;(await cookies()).delete(KEYCLOAK_ACCESS_TOKEN_COOKIE_NAME)
  ;(await cookies()).delete(KEYCLOAK_ID_TOKEN_COOKIE_NAME)

  return true
}

// note: see https://github.com/nextauthjs/next-auth/blob/3d5c3043ea07036db547b8be5444f22a5e2fa289/packages/core/src/lib/utils/env.ts#L75-L84 for source
// note: see https://github.com/nextauthjs/next-auth/issues/3419#issuecomment-1013980190 for motivation
//
// Order of precedence:
//   1. SITE_URL — a fixed, operator-controlled origin (set this on self-host).
//   2. Hardcoded `https://status.app` for Vercel production deployments.
//   3. Vercel preview — read `x-forwarded-*` (Vercel sanitizes the host header).
//   4. Local dev — `http://localhost:PORT`.
//
// `x-forwarded-host` is intentionally NOT trusted on self-hosted without
// SITE_URL — see https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/07-Input_Validation_Testing/17-Testing_for_Host_Header_Injection
export async function getBaseUrl(): Promise<string> {
  if (serverEnv.SITE_URL) {
    return serverEnv.SITE_URL.replace(/\/$/, '')
  }

  if (serverEnv.VERCEL_ENV === 'production') {
    return 'https://status.app'
  }

  if (serverEnv.VERCEL) {
    const requestHeaders = await headers()
    const host =
      requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
    const protocol = requestHeaders.get('x-forwarded-proto') ?? 'https'

    return `${protocol.replace(':', '')}://${host}`
  }

  return `http://localhost:${serverEnv.PORT ?? 3001}`
}

export async function getRedirectUrl() {
  return (await getBaseUrl()) + '/login/keycloak/callback'
}
