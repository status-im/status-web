import statusAppConfig from '../status.app/tailwind.config'

import type { Config } from 'tailwindcss'

const config: Config = {
  ...statusAppConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../status.app/src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@status-im/components/dist/**/*.js',
  ],
}

export default config
