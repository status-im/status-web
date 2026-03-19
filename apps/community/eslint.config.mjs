import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.config({
    extends: ['plugin:@typescript-eslint/recommended', 'eslint:recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
    },
    env: {
      node: true,
      mocha: true,
      browser: true,
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
      'prefer-const': ['error', { destructuring: 'all' }],
      semi: ['error', 'never'],
      'no-extra-semi': 'off',
      '@typescript-eslint/no-extra-semi': 'off',
    },
  }),
  {
    ignores: ['src/helpers/waku.ts'],
  },
]
