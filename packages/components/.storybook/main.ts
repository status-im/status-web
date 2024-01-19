import { dirname, join } from 'path'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: getAbsolutePath('@storybook/react-vite'),

  typescript: {
    reactDocgen: false,
  },

  stories: [
    '../src/**/*.mdx',
    '../src/_components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('storybook-addon-designs'),
    getAbsolutePath('storybook-dark-mode'),
  ],

  // docs: {
  //   autodocs: 'tag',
  // },
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
