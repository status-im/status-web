/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/default */

// For "Build dependencies behind this expression are ignored and might cause incorrect cache invalidation." warning
// @see https://github.com/contentlayerdev/contentlayer/issues/129#issuecomment-1080416633

import './src/config/env.server.mjs'
import './src/config/env.client.mjs'

import tamaguiNextPlugin from '@tamagui/next-plugin'
import { withContentlayer } from 'next-contentlayer'
import { join } from 'node:path'

const { withTamagui } = tamaguiNextPlugin

/** @type {import('next').NextConfig} */
let config = {
  // output: 'export',
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  // runs on the root level
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // disableStaticImages: true,
  },
  transpilePackages: [
    // 'react-native',
    'react-native-web',
    // 'expo-modules-core',
    'expo-blur',
    // '@status-im/components',
    // '@status-im/js',
  ],
  experimental: {
    legacyBrowsers: false,
    // esmExternals: 'loose',
    scrollRestoration: true,
  },
}

const plugins = [
  withContentlayer,
  withTamagui({
    config: './tamagui.config.ts',
    components: [
      // fixme?: works without it
      // '@status-im/icons',
      '@status-im/components',
      // './node_modules/@status-im/components/packages/components/dist',
    ],
    importsWhitelist: ['constants.js', 'colors.js'],
    logTimings: true,
    disableExtraction: true,
    // experiment - reduced bundle size react-native-web
    useReactNativeWebLite: false,
    shouldExtract: path => {
      if (path.includes(join('packages', 'app'))) {
        return true
      }
    },
    excludeReactNativeWebExports: [
      'Switch',
      'ProgressBar',
      'Picker',
      'CheckBox',
      'Touchable',
      'Modal',
    ],
  }),
  // withMDX,
]

export default () => {
  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}
