module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['@status-im/eslint-config', 'plugin:tailwindcss/recommended'],

      rules: {
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
      // parser: 'esprima',
      files: ['*.mjs'],
      // env: {
      //   browser: true,
      //   es2021: true,
      // },
      // extends: ['eslint:recommended', 'plugin:import/recommended'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    {
      files: ['*.js'],
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
  ],
}
