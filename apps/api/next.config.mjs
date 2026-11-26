import './src/config/env.server.mjs'

/** @type {import('next').NextConfig} */
let config = {
  agentRules: false,
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

  experimental: {
    // note: requires Next.js Canary https://nextjs.org/docs/messages/ppr-preview
    // ppr: 'incremental',
    serverComponentsHmrCache: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
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
