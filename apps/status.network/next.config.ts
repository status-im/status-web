import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { serverEnv } from './src/config/env.server.mjs'
import { redirects } from './vercel.json'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const GHOST_IMAGE_HOSTS = ['our.status.im', 'demo.ghost.io']

const nextConfig: NextConfig = {
  agentRules: false,
  // Vercel serves the redirects for the static export. Next.js serves them in dev.
  ...(serverEnv.NODE_ENV === 'production'
    ? { output: 'export' }
    : { redirects: async () => redirects }),

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
}

export default withNextIntl(nextConfig)
