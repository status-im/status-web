/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('next').NextConfig} */
import withMDX from '@next/mdx'
import tamagui from '@tamagui/next-plugin'
import { join } from 'path'
import remarkBreaks from 'remark-breaks'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkAdmonitions from 'remark-github-beta-blockquote-admonitions'
import remarkFrontmatter from 'remark-frontmatter'

/** @type {import('next').NextConfig} */
let config = {
  // output: 'export',
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  // TODO: REMOVE!
  typescript: {
    ignoreBuildErrors: true,
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
  withMDX({
    extension: /\.mdx?$/,
    options: {
      // If you use remark-gfm, you'll need to use next.config.mjs
      // as the package is ESM only
      // https://github.com/remarkjs/remark-gfm#install
      remarkPlugins: [
        remarkGfm,
        remarkDirective,
        remarkBreaks,
        [remarkFrontmatter, { type: 'yaml', marker: '-' }]
        [
          remarkAdmonitions,
          {
            titleFilter: ['note', 'tip', 'caution'],
            titleUnwrap: true,
          },
        ],
      ],
      rehypePlugins: [],
      // If you use `MDXProvider`, uncomment the following line.
      providerImportSource: '@mdx-js/react',
    },
  }),
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
  withMDX,
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
