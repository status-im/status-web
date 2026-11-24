import { serverEnv } from './src/config/env.server.mjs'
import './src/config/env.client.mjs'

import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Turbopack requires project-relative paths (not absolute).
const turbopackAliases = {
  '~/config/routes': './src/config/routes.ts',
  '~/config/site-scope': './src/config/site-scope.ts',
  '~/config/env.server.mjs': './src/config/env.server.mjs',
  '~/config/env.client.mjs': './src/config/env.client.mjs',
  '~website/_lib/ghost': './src/stubs/ghost.ts',
  '~components/assets$': './src/app/_components/assets',
  '~components/assets': './src/app/_components/assets',
  '~components': '../status.app/src/app/_components',
  '~hooks': '../status.app/src/app/_hooks',
  '~website': '../status.app/src/app/(website)',
  '~server': '../status.app/src/server',
  '~app': '../status.app/src/app',
  '~public': '../status.app/public',
  '~': '../status.app/src',
}

/** @type {import('next').NextConfig} */
const config = {
  agentRules: false,
  ...(serverEnv.NODE_ENV === 'production' && { output: 'export' }),
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  experimental: {
    externalDir: true,
  },
  turbopack: {
    resolveAlias: turbopackAliases,
  },
  transpilePackages: [
    '@status-im/icons',
    '@status-im/components',
    '@status-im/colors',
    '@status-im/js',
    // Shared status.app MDX uses Shiki, which needs bundling in Turbopack.
    'shiki',
  ],
}

export default () => withNextIntl(config)
