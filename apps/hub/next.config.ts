import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    // why: https://github.com/hashicorp/next-mdx-remote/issues/467#issuecomment-2432166413
    'next-mdx-remote',
    '@status-im/components',
    '@status-im/icons',
    'portfolio',
  ],
}

export default nextConfig
