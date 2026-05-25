import path from 'node:path'
import { fileURLToPath } from 'node:url'

import './src/config/env.server.mjs'
import './src/config/env.client.mjs'

import createNextIntlPlugin from 'next-intl/plugin'

import { serverEnv } from './src/config/env.server.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const statusAppRoot = path.join(__dirname, '../status.app')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Turbopack requires project-relative paths (not absolute).
const turbopackAliases = {
  '~/config/routes': './src/config/routes.ts',
  '~/config/site-scope': './src/config/site-scope.ts',
  '~/config/env.server.mjs': './src/config/env.server.mjs',
  '~/config/env.client.mjs': './src/config/env.client.mjs',
  '~website/_lib/ghost': './src/stubs/ghost.ts',
  '~website/_components/latest-version-tag': './src/website/latest-version-tag.tsx',
  '~components/assets': './src/app/_components/assets',
  '~components': '../status.app/src/app/_components',
  '~hooks': '../status.app/src/app/_hooks',
  '~website': '../status.app/src/app/(website)',
  '~server': '../status.app/src/server',
  '~app': '../status.app/src/app',
  '~public': '../status.app/public',
  '~': '../status.app/src',
}

// Webpack (production build) accepts absolute paths.
const webpackAliases = {
  '~/config/routes': path.join(__dirname, 'src/config/routes.ts'),
  '~/config/site-scope': path.join(__dirname, 'src/config/site-scope.ts'),
  '~/config/env.server.mjs': path.join(__dirname, 'src/config/env.server.mjs'),
  '~/config/env.client.mjs': path.join(__dirname, 'src/config/env.client.mjs'),
  '~website/_lib/ghost': path.join(__dirname, 'src/stubs/ghost.ts'),
  '~website/_components/latest-version-tag': path.join(
    __dirname,
    'src/website/latest-version-tag.tsx',
  ),
  '~components/assets': path.join(__dirname, 'src/app/_components/assets'),
  '~components': path.join(statusAppRoot, 'src/app/_components'),
  '~hooks': path.join(statusAppRoot, 'src/app/_hooks'),
  '~website': path.join(statusAppRoot, 'src/app/(website)'),
  '~server': path.join(statusAppRoot, 'src/server'),
  '~app': path.join(statusAppRoot, 'src/app'),
  '~public': path.join(statusAppRoot, 'public'),
  '~': path.join(statusAppRoot, 'src'),
}

/** @type {import('next').NextConfig} */
let config = {
  ...(serverEnv.NODE_ENV === 'production' && { output: 'export' }),
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      ...webpackAliases,
    }

    if (!isServer) {
      webpackConfig.resolve.fallback.fs = false
      webpackConfig.resolve.fallback.tls = false
      webpackConfig.resolve.fallback.net = false
      webpackConfig.resolve.fallback.child_process = false
    }

    return webpackConfig
  },
  transpilePackages: [
    '@status-im/icons',
    '@status-im/components',
    '@status-im/colors',
    '@status-im/js',
  ],
}

export default () => withNextIntl(config)
