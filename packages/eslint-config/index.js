// why: https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config
import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

import eslintJs from '@eslint/js'
import globals from 'globals'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import prettierPlugin from 'eslint-config-prettier'
import tailwindcssPlugin from 'eslint-plugin-tailwindcss'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.Config[]} */
export default [
  eslintJs.configs.recommended,
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:import/recommended'),
  importPlugin.configs.typescript,
  ...compat.extends('plugin:jsx-a11y/recommended'),
  ...compat.extends('plugin:react/jsx-runtime'),
  ...compat.extends('plugin:react-hooks/recommended'),
  {
    name: '@status-im/eslint-config',
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
      'eslint-comments': eslintCommentsPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    rules: {
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
  {
    files: ['examples/**/*.tsx'],
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]

export const tailwindcssConfig = {
  plugins: { tailwindcss: tailwindcssPlugin },
  rules: {
    'tailwindcss/classnames-order': 'off',
  },
}
