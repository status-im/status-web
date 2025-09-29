// For "Build dependencies behind this expression are ignored and might cause incorrect cache invalidation." warning
// @see https://github.com/contentlayerdev/contentlayer/issues/129#issuecomment-1080416633

import './src/config/env.server.mjs'
import './src/config/env.client.mjs'

import { withContentlayer } from 'next-contentlayer'
// eslint-disable-next-line import/no-unresolved
import withVercelToolbar from '@vercel/toolbar/plugins/next'

/** @type {import('next').NextConfig} */
let config = {
  // output: 'export',
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  // runs on the root level
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // note: handled by npm scripts which can specify --ext option to fiter out markdown files and let remark process them
    ignoreDuringBuilds: true,
    // ignoreDuringBuilds: false,
    // dirs: ['src'],
    // ignoreDuringBuilds: true,
    // dirs: ['src', 'docs'],
  },

  images: {
    // disableStaticImages: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        port: '',
        pathname: '/markets/images/**',
      },
      // TODO remove this once we have everything connected to cloudinary for the admin tool
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
    ],
  },
  experimental: {
    // note: https://nextjs.org/blog/turbopack-for-development-stable#breaking-changes
    turbo: {
      resolve: {
        alias: {
          '@achingbrain/nat-port-mapper': {
            browser: false,
          },
        },
      },
      rules: {
        fs: {
          // note: https://github.com/vercel/next.js/discussions/67196
          // note: https://github.com/vercel/next.js/pull/64205 available only in canary?
          browser: false,
        },
        tls: {
          browser: false,
        },
        net: {
          browser: false,
        },
        child_process: {
          browser: false,
        },
      },
    },
  },
  // note: fallback for non-Turbopack builds
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@achingbrain/nat-port-mapper': false,
        // note: https://stackoverflow.com/questions/72325544/react-component-cannot-read-properties-of-null-reading-usestate#comment127826083_72325544 for `yarn link @status-im/components
        // react: path.resolve('./node_modules/react'),
      }
      // Google Spreadsheet API requires that webpack does not fallback with these node.js core modules, which are not available in the browser.
      config.resolve.fallback.fs = false
      config.resolve.fallback.tls = false
      config.resolve.fallback.net = false
      config.resolve.fallback.child_process = false
    }

    // note: https://github.com/contentlayerdev/contentlayer/issues/129#issuecomment-1080416633
    // note: https://github.com/vercel/next.js/issues/33693
    config.infrastructureLogging = {
      level: 'error',
    }

    return config
  },
  transpilePackages: [
    '@status-im/icons',
    '@status-im/components',
    '@status-im/colors',
    '@status-im/js',
    // '@achingbrain/nat-port-mapper',
    // 'js-waku',
    // 'libp2p',
    // why: https://github.com/hashicorp/next-mdx-remote/issues/467#issuecomment-2432166413
    'next-mdx-remote',
    // 'next-contentlayer',
    // 'contentlayer',
    // '@contentlayer/source-files',
    // '@contentlayer/source-remote-files',
    // '@contentlayer/utils',
  ],
  headers: async () => {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/status-network',
        destination: 'https://status.network',
        permanent: false,
      },
      {
        source: '/jobs',
        has: [
          {
            type: 'query',
            key: 'gh_jid',
            value: '(?<paramName>.*)',
          },
        ],
        permanent: false,
        destination: '/jobs/:paramName',
      },
      {
        source: '/feature-upvote',
        destination: 'https://discuss.status.app/c/features/51',
        permanent: false,
      },
    ]
  },
}

const plugins = [withVercelToolbar(), withContentlayer]

export default () => {
  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}
