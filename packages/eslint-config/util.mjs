// why: https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended, // optional unless using "eslint:recommended"
})

export { compat }