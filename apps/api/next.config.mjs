// For "Build dependencies behind this expression are ignored and might cause incorrect cache invalidation." warning
// @see https://github.com/contentlayerdev/contentlayer/issues/129#issuecomment-1080416633

import './src/config/env.server.mjs'

/** @type {import('next').NextConfig} */
let config = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

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

  experimental: {
    // note: requires Next.js Canary https://nextjs.org/docs/messages/ppr-preview
    // ppr: 'incremental',
    serverComponentsHmrCache: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // note: https://nextjs.org/blog/turbopack-for-development-stable#breaking-changes
    turbo: {
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
  transpilePackages: ['@status-im/wallet'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}

const plugins = []

export default () => {
  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}
