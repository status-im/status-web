import config, { tailwindcssConfig } from '@status-im/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist', 'index.js', 'index.es.js'],
  },
  {
    files: ['*.ts', '*.tsx'],
    ...config,
    ...tailwindcssConfig,
    rules: {
      ...config.rules,
      ...tailwindcssConfig.rules,
      'no-constant-binary-expression': 'error',
      'no-restricted-globals': ['error', 'process'],
      'jsx-a11y/alt-text': [
        1,
        {
          img: [],
        },
      ],
    },
  },
  {
    files: ['*.js'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['*.js'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
  },
]
