import configs, { tailwindcssConfigs } from '@status-im/eslint-config'

import { parser as mdxParser } from 'eslint-mdx'
import mdxPlugin from 'eslint-plugin-mdx'
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
    files: ['**/*.md', '**/*.mdx'],
    // note: does not report all warning/errors as remark-cli does
    languageOptions: {
      parser: mdxParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      // globals: {
      //   // React: false,
      //   // "Admonition": false
      //   Admonition: 'readonly',
      // },
    },
    plugins: {
      mdx: mdxPlugin,
    },
    processor: mdxPlugin.processors.remark,
    settings: {
      'mdx/code-blocks': true,
    },
    rules: {
      // // note: conflicts with remark by adding {' '} in (nested) jsx
      // 'prettier/prettier': 'off',
      'prettier/prettier': 'warn',
      // note: enables other remark rules from remarkconfig in vscode?
      'mdx/remark': 'warn',
      'react/jsx-no-undef': [
        'warn',
        {
          allowGlobals: true,
        },
      ],
      'react/react-in-jsx-scope': 'off',
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
