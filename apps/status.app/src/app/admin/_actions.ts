'use server'

import { getBaseUrl, invalidateSession } from '~server/services/auth'

export async function signOut() {
  await invalidateSession()
  await fetch(new URL('/login/keycloak', await getBaseUrl()).toString(), {
    cache: 'no-store',
  })
}
