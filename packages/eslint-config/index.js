module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // TODO: Enable type-aware linting (https://typescript-eslint.io/docs/linting/type-linting)
    // "tsconfigRootDir": ".",
    // "project": ["./packages/*/tsconfig.json"],
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    warnOnUnsupportedTypeScriptVersion: true,
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'react',
    'jsx-a11y',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  overrides: [
    {
      files: ['examples/**/*.tsx'],
      rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
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
}
