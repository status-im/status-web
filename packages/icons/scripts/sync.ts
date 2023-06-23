import { isCancel, outro, spinner, text } from '@clack/prompts'
import { transform } from '@svgr/core'
import * as Figma from 'figma-api'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import path from 'path'
import prettier from 'prettier'

const SVG_DIR = path.resolve(__dirname, '../svg')

await fs.ensureDir(SVG_DIR)

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // convert camel case to kebab case
    .replace(/[\s_]+/g, '-') // replace spaces and underscores with hyphens
    .toLowerCase()
}

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

// https://www.figma.com/file/qLLuMLfpGxK9OfpIavwsmK/Iconset?node-id=3239-987
const FILE_KEY = 'qLLuMLfpGxK9OfpIavwsmK'

const NODE_IDS = {
  '3239:987': 'icons',
  '3227:1083': 'social',
  // '942:77': 'reactions',
  '942:218': 'love',
  '942:217': 'thumbs-up',
  '942:216': 'thumbs-down',
  '942:215': 'laugh',
  '942:213': 'angry',
}

const figma = new Figma.Api({
  personalAccessToken,
})

const s1 = spinner()
s1.start('Fetching nodes from Figma')
const { nodes } = await figma.getFileNodes(FILE_KEY, Object.keys(NODE_IDS))
s1.stop('Done!')

for (const [nodeId, name] of Object.entries(NODE_IDS)) {
  const s2 = spinner()
  s2.start('Fetching nodes from Figma')

  const { components } = nodes[nodeId]!
  const nodeIds = Object.keys(components)

  const { err, images } = await figma.getImage(FILE_KEY, {
    ids: nodeIds.join(','),
    format: 'svg',
    scale: 1,
  })

  if (err) {
    s2.stop('Error!')
    console.error(err)
    process.exit(1)
  }

  s2.stop('Done!')

  const s3 = spinner()
  s3.start(`Generating SVGs for ${name}`)

  for (const [nodeId, image] of Object.entries(images)) {
    const icon = components[nodeId]!

    const svgRaw = await fetch(image!).then(res => res.text())

    const svg = await transform(svgRaw, {
      plugins: ['@svgr/plugin-svgo'],
      replaceAttrValues: {
        // '#000': 'currentColor',
      },
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupIds: {
                  minify: false,
                },
                // viewBox is required to resize SVGs with CSS.
                // @see https://github.com/svg/svgo/issues/1128
                removeViewBox: false,
              },
            },
          },
        ],
      },
    })

    const nameParts = icon.name.replace(' / ', '/').split('/')
    const iconName = nameParts[nameParts.length - 1]
    const fileName = `${toKebabCase(iconName)}-icon.svg`
    const filePath = path.resolve(SVG_DIR, fileName)

    const prettierOptions = prettier.resolveConfig.sync(process.cwd())
    const formattedSvg = prettier.format(svg, {
      ...prettierOptions,
      parser: 'html',
    })

    await fs.writeFile(filePath, formattedSvg, { encoding: 'utf8' })
  }

  s3.stop(`${Object.keys(images).length} SVGs generated`)
}
