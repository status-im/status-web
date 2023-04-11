/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const { join } = require('path')

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1'

/** @type {import('next').NextConfig} */
let config = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    disableStaticImages: true,
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
      'Modal'
    ],
  }),
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
