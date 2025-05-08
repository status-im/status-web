import configs, { tailwindcssConfigs } from '@status-im/eslint-config'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs,
  ...tailwindcssConfigs,
  {
    files: ['**/*.ts', '**/*.mts', '**/*.mjs', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
]
