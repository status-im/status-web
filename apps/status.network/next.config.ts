import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
const GHOST_IMAGE_HOSTS = ['our.status.im', 'demo.ghost.io']

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    // why: https://github.com/hashicorp/next-mdx-remote/issues/467#issuecomment-2432166413
    'next-mdx-remote',
  ],
  images: {
    remotePatterns: GHOST_IMAGE_HOSTS.map(hostname => ({
      protocol: 'https',
      hostname,
      pathname: '/content/images/**',
    })),
  },
}

export default withNextIntl(nextConfig)
