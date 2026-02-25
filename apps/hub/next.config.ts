import createNextIntlPlugin from 'next-intl/plugin'

import { serverEnv } from './src/app/_constants/env.server.mjs'

import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
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
    // @see https://nextjs.org/docs/app/guides/static-exports#image-optimization
    // loader: 'custom',
    // loaderFile: './loader.ts',
  },
}

export default withNextIntl(nextConfig)
