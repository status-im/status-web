import { intro, isCancel, outro, spinner, text } from '@clack/prompts'
import * as Figma from 'figma-api'
import fs from 'fs-extra'

import type { GetFileNodesResult } from 'figma-api/lib/api-types'

const FILE_KEY = 'v98g9ZiaSHYUdKWrbFg9eM'

intro('🟥🟧🟨🟩🟦🟪🟫⬛⬜')

const personalAccessToken = await text({
  message: 'Your personal Figma access token:',
  validate(value) {
    if (value.length === 0) return `required`
  },
})

if (isCancel(personalAccessToken)) {
  outro('Bye!')
  process.exit(0)
}

function sortObjectByKey<T extends Record<string, any>>(obj: T): T {
  const sortedObj: Record<string, any> = {}
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sortedObj[key] = obj[key]
    })
  return sortedObj as T
}

const figma = new Figma.Api({
  personalAccessToken,
})

/**
 * Get file styles from Figma
 */
const s = spinner()
s.start('Fetching styles from Figma')

const styles = await figma.getFileStyles(FILE_KEY)

if (styles.error) {
  console.log('error:', styles.error)
  outro('Error!')
  process.exit(1)
}

s.stop('Done!')

/**
 * Get colors tokens from Figma
 */
const s2 = spinner()
s2.start('Fetching tokens from Figma')

const nodeIds = styles
  .meta!.styles.filter(style => style.style_type === 'FILL')
  .map(style => style.node_id)

const { nodes } = (await figma.getFileNodes(
  FILE_KEY,
  nodeIds
)) as GetFileNodesResult<'FRAME'>
s2.stop('Done!')

/**
 * Generate files
 */
const s3 = spinner()
s3.start('Generating colors')

const colors: Record<string, Record<string, string>> = {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
for (const [_nodeId, value] of Object.entries(nodes)) {
  const { document } = value!

  const { r, g, b } = document.fills[0].color!
  const a = document.fills[0].opacity ?? 1

  const red = Math.round(r * 255)
  const green = Math.round(g * 255)
  const blue = Math.round(b * 255)
  const alpha = Math.round(a * 100)

  const name = toKebabCase(document.name).replace('-/-', '/')
  const [namespace, ...rest] = name.split('/')
  const tokenName = normalizeName(namespace, rest.join('-'))

  colors[namespace] ??= {}
  colors[namespace][tokenName] = `rgba(${red} ${green} ${blue} / ${alpha}%)`
}

/**
 * Write tokens to src folder
 */

fs.ensureDirSync('./src')

for (const [namespace, value] of Object.entries(colors)) {
  const fileName = `./src/${namespace}.ts`

  const tokens = JSON.stringify(sortObjectByKey(value), null, 2)

  fs.writeFileSync(fileName, `export const ${namespace} = ${tokens}`, {
    encoding: 'utf-8',
  })
}

// re-export from index
fs.writeFileSync(
  './src/index.ts',
  Object.keys(colors)
    .map(key => `export { ${key} } from './${key}'`)
    .join('\n'),
  { encoding: 'utf-8' }
)

s3.stop('Done!')

function normalizeName(_tokenName: string, value: string): string {
  let normalizedValue = value

  normalizedValue = value.replace('solid-', '')
  normalizedValue = normalizedValue.replace('%', '')
  normalizedValue = normalizedValue.replace('-transparent-opa', '/')
  normalizedValue = normalizedValue.replace('-transparent-', '/')
  normalizedValue = normalizedValue.replace('transparent-', '/')
  normalizedValue = normalizedValue.replace('-opa-', '/')

  return normalizedValue
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // convert camel case to kebab case
    .replace(/[\s_]+/g, '-') // replace spaces and underscores with hyphens
    .toLowerCase()
}
