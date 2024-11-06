import config, { tailwindcssConfig } from '@status-im/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config,
  {
    ...tailwindcssConfig,
  },
]
