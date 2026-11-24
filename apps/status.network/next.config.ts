import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { serverEnv } from './src/config/env.server.mjs'
import { redirects } from './vercel.json'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const GHOST_IMAGE_HOSTS = ['our.status.im', 'demo.ghost.io']

const nextConfig: NextConfig = {
  agentRules: false,
  // Only enable static export for builds, not dev mode
  // This allows middleware to work in dev mode for locale routing
  ...(serverEnv.NODE_ENV === 'production' && { output: 'export' }),

  /* config options here */
  transpilePackages: [
    // why: https://github.com/hashicorp/next-mdx-remote/issues/467#issuecomment-2432166413
    'next-mdx-remote',
    '@status-im/components',
    '@status-im/icons',
  ],
  images: {
    unoptimized: true,
    remotePatterns: GHOST_IMAGE_HOSTS.map(hostname => ({
      protocol: 'https',
      hostname,
      pathname: '/content/images/**',
    })),
  },
  ...(serverEnv.NODE_ENV === 'development' && {
    async redirects() {
      return redirects
    },
  }),
}

export default withNextIntl(nextConfig)
