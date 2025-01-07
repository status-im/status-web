// // @ts-check

import js from '@eslint/js'
import globals from 'globals'
import {
  parser as typescriptParser,
  plugin as typescriptPlugin,
  configs as typescriptConfigs,
} from 'typescript-eslint'
import commentsPlugin from 'eslint-plugin-eslint-comments'
import * as importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import tailwindcssPlugin from 'eslint-plugin-tailwindcss'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: '@status-im/eslint-config',
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
    },
    files: [
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.jsx',
      '**/*.ts',
      '**/*.mts',
      '**/*.tsx',
      '**/*.mdx',
    ], // js, ts, mdx
  },
  {
    ...js.configs.recommended,
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.ts', '**/*.tsx'], // js
  },
  ...typescriptConfigs.recommended.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.mts', '**/*.tsx'],
  })),
  {
    ...jsxA11yPlugin.flatConfigs.recommended,
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.ts', '**/*.tsx'],
  },
  {
    ...reactPlugin.configs.flat['jsx-runtime'],
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.ts', '**/*.tsx'],
  },
  {
    ...prettierPlugin,
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.ts',
      '**/*.tsx',
      '**/*.md',
      '**/*.mdx',
    ],
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.tsx'], // ts
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        // TODO: Enable type-aware linting (https://typescript-eslint.io/docs/linting/type-linting)
        // "tsconfigRootDir": ".",
        // "project": ["./packages/*/tsconfig.json"],
        // sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        // warnOnUnsupportedTypeScriptVersion: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'eslint-comments': commentsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      ...importPlugin.configs.typescript.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/prop-types': 0,
      // "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      '@typescript-eslint/consistent-type-imports': 'error',
      // TODO: turn on this rul
      '@typescript-eslint/no-non-null-assertion': 'off',
      // "@typescript-eslint/consistent-type-exports": "error",
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // `react` related packages come first.
            ['^react$', '^react-dom$'],
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['^@?\\w'],
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ['^'],
            // Relative imports.
            // Anything that starts with a dot.
            ['^\\.'],
            // type imports last as a separate group
            ['^.+\\u0000$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          project: [
            'tsconfig.base.json',
            'packages/*/tsconfig.json',
            'apps/*/tsconfig.json',
          ],
        },
        typescript: {
          alwaysTryTypes: true,
          project: [
            'tsconfig.base.json',
            'packages/*/tsconfig.json',
            'apps/*/tsconfig.json',
          ],
        },
      },
    },
  },
]

/** @type {import('eslint').Linter.Config[]} */
export const tailwindcssConfigs = [
  {
    files: ['**/*.ts', '**/*.mts', '**/*.tsx'],
  },
  ...tailwindcssPlugin.configs['flat/recommended'],
  {
    rules: {
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/migration-from-tailwind-2': 'off',
    },
    settings: {
      tailwindcss: {
        callees: ['cx', 'cva'],
      },
    },
  },
]
