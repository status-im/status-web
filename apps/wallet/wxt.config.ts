import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
// import react from '@vitejs/plugin-react'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'
// import path from 'node:path'
// import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifestVersion: 3,
  manifest: {
    name: 'A wallet by Status',
    permissions: ['sidePanel', 'storage'],
    web_accessible_resources: [
      {
        resources: ['/wallet-core.wasm'],
        // fixme:
        matches: ['<all_urls>'],
      },
    ],
    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
    },
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
