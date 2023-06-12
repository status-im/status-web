/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('next').NextConfig} */
// const withMDX = require('@next/mdx')
const tamagui = require('@tamagui/next-plugin')
const { withContentlayer } = require('next-contentlayer')
const { join } = require('path')

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
  },
}

const plugins = [
  withContentlayer,
  tamagui.withTamagui({
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

module.exports = () => {
  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}
