import configs from '@status-im/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs,
  {
    files: ['**/*.ts', '**/*.mts', '**/*.mjs', '**/*.tsx'],
  },
]
