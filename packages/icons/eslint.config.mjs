import config from '@status-im/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config,
  {
    ignores: ['dist', 'index.js', 'index.es.js'],
  },
]
