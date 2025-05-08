import configs, { tailwindcssConfigs } from '@status-im/eslint-config'

import nextPlugin from '@next/eslint-plugin-next'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '**/.next',
      '**/dist',
      '**/node_modules',
      '**/protos',
      '**/proto',
      '**/coverage',
      '**/storybook-static',
      '**/examples',
      '**/packages/status-react',
      'generate-cloudinary-names.mjs',
      'src/lib/graphql/generated',
    ],
  },
  ...configs,
  ...tailwindcssConfigs,
  {
    files: ['**/*.ts', '**/*.mts', '**/*.tsx'], // ts
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.tsx'], // ts
    rules: {
      'no-constant-binary-expression': 'error',
      'no-restricted-globals': ['error', 'process'],
      // todo: enable
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
    files: ['**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
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
