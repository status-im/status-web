import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
// import react from '@vitejs/plugin-react'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'
// import path from 'node:path'
// import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  imports: false,
  srcDir: 'src',
  // extensionApi: 'chrome',
  // extensionApi: 'webextension-polyfill',
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  manifestVersion: 3,
  manifest: ({ mode }) => {
    const scriptSrc =
      mode === 'production'
        ? "'self' 'wasm-unsafe-eval'"
        : "'self' 'wasm-unsafe-eval' http://localhost:4000/ http://localhost:8097/"
    const connectSrc =
      mode === 'production'
        ? 'https://status-api-status-im-web.vercel.app/ https://status-api-status-im-web.vercel.app/api/'
        : 'ws: http://localhost:3030/ https://localhost:3030/'

    return {
      version: '0.1.0',
      name: '!Status Portfolio Wallet (Beta)',
      description:
        'Easily view and manage your crypto portfolio in real time — Beta crypto wallet and Web3 portfolio tracker in one.',
      permissions: ['storage'],
      action: {},
      web_accessible_resources: [
        {
          resources: ['/wallet-core.wasm'],
          // fixme:
          matches: ['<all_urls>'],
        },
      ],
      content_security_policy: {
        extension_pages: `script-src ${scriptSrc}; object-src 'self'; connect-src 'self' ${connectSrc}`,
      },
    }
  },
  runner: {
    disabled: true,
  },

  vite: () => ({
    define: {
      'process.env': {
        ALCHEMY_API_KEY: 'test',
        INFURA_API_KEY: 'test',
        CRYPTOCOMPARE_API_KEY: 'test',
        COINGECKO_API_KEY: 'test',
        MERCURYO_SECRET_KEY: 'test',
        VERCEL: 'test',
        VERCEL_ENV: 'test',
      },
    },
    build: {
      target: 'esnext',
    },
    // resolve: {
    //   alias: {
    //     // buffer: 'buffer/',
    //     '@/': path.resolve(__dirname, 'foo'),
    //     '@portfolio/': path.resolve(__dirname, '../../portfolio/src'),
    //   },
    // },
    plugins: [
      // tsconfigPaths({
      //   // loose: true,
      // }),
      // react(),
      TanStackRouterVite({
        // target: 'react',
        // autoCodeSplitting: true,
        routeToken: '_layout',
      }),
      // nodePolyfills({
      //   // include: ['path', 'stream', 'util'],
      //   exclude: ['http'],
      //   globals: {
      //     // Buffer: true,
      //     global: true,
      //     process: true,
      //   },
      //   // overrides: {
      //   //   fs: 'memfs',
      //   // },
      //   // protocolImports: true,
      // }),
    ],
    // build: {
    //   rollupOptions: {
    //     // external: ['buffer'],
    //     plugins: []
    //   },
    // },
  }),
})
