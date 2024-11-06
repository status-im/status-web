import config from '@status-im/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config,
  {
    files: ['./src/protos/**/*_pb.ts'],
    rules: {
      'eslint-comments/disable-enable-pair': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
    },
  },
]
