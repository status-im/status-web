import configs, { tailwindcssConfigs } from '@status-im/eslint-config'
import nextPlugin from '@next/eslint-plugin-next'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '**/.next',
      '**/dist',
      '**/node_modules',
      '**/coverage',
    ],
  },
  ...configs,
  ...tailwindcssConfigs,
  {
    files: ['**/*.ts', '**/*.mts', '**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.tsx'],
    rules: {
      'no-constant-binary-expression': 'error',
      'no-restricted-globals': ['error', 'process'],
      '@typescript-eslint/no-explicit-any': 'off',
      'jsx-a11y/alt-text': [
        1,
        {
          img: [],
        },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
]
