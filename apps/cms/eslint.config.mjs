import nextPlugin from '@next/eslint-plugin-next'
import configs from '@status-im/eslint-config'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '**/.next',
      '**/node_modules',
      'src/app/(payload)/admin/importMap.js',
    ],
  },
  ...configs,
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
    files: ['**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
