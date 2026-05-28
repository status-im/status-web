import { clientEnv } from './env.client.mjs'

const siteHost = clientEnv.NEXT_PUBLIC_VERCEL_URL ?? ''

export const isGetSite = siteHost.includes('get.status.app')
