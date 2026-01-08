// For "Build dependencies behind this expression are ignored and might cause incorrect cache invalidation." warning
// @see https://github.com/contentlayerdev/contentlayer/issues/129#issuecomment-1080416633

import './src/config/env.server.mjs'

/** @type {import('next').NextConfig} */
let config = {
  // CORS configuration - allows resources to be fetched with CORS requests
  // @see https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/
  crossOrigin: 'anonymous', // or 'use-credentials' if credentials are needed

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
  // Layer 2: Framework-level CORS headers via next.config.mjs
  // @see https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/
  // These headers are applied at the Next.js framework level before route handlers
  async headers() {
    return [
      {
        // Apply to all API routes explicitly
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // 24 hours
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      {
        // Fallback for all other routes
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
