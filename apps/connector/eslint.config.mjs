import configs, { tailwindcssConfigs } from '@status-im/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs,
  ...tailwindcssConfigs,
  {
    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-constant-binary-expression': 'error',
      'no-restricted-globals': ['error', 'process'],
      'jsx-a11y/alt-text': [
        1,
        {
          img: [],
        },
      ],
      'no-empty': 'warn',
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
  },
  {
    ignores: ['.plasmo'],
  },
]
