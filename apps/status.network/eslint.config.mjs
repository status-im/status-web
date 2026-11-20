import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default [
  ...nextVitals,
  ...nextTypescript,
  ...tailwindcss.configs['flat/recommended'],
  {
    rules: {
      'no-constant-binary-expression': 'error',
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/migration-from-tailwind-2': 'off',
    },
    settings: {
      tailwindcss: {
        callees: ['cva', 'cx'],
      },
    },
  },
]
