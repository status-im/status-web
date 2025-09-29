import { clientEnv } from '~/config/env.client.mjs'

export function baseUrl() {
  if (clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'https://status.app'
  }

  if (clientEnv.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${clientEnv.NEXT_PUBLIC_VERCEL_URL}`
  }

  return `http://localhost:${clientEnv.PORT ?? 3000}`
}
