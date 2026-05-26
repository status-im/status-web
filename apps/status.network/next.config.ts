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
  async redirects() {
    return [
      {
        source:
          '/blog/pre-deposit-vaults-withdrawal-timeline-and-rewards-distribution',
        destination:
          'https://status.app/blog/pre-deposit-vaults-withdrawal-timeline-and-rewards-distribution',
        statusCode: 301,
      },
      {
        source:
          '/blog/status-network-merges-with-linea-scaling-gasless-privacy-upstream',
        destination:
          'https://status.app/blog/status-network-merges-with-linea-scaling-gasless-privacy-upstream',
        statusCode: 301,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
