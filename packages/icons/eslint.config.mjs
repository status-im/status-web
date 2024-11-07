import configs from '@status-im/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs,
  {
    ignores: ['dist', 'index.js', 'index.es.js'],
  },
]
