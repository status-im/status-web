import configs from '@status-im/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs,
  {
    files: ['./src/protos/**/*_pb.ts'],
    rules: {
      'eslint-comments/disable-enable-pair': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
    },
  },
]
