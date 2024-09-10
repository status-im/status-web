import { isCancel, log, outro, spinner, text } from '@clack/prompts'
import { transform } from '@svgr/core'
import * as Figma from 'figma-api'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import pMap from 'p-map'
import path from 'path'

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
  // currently generates only set of size 20
  // https://github.com/status-im/status-web/issues/466
  '3239:987': {
    name: 'icons-20',
    folder: '20',
  },
  '3239:1440': {
    name: 'icons-16',
    folder: '16',
  },
  '3239:3712': {
    name: 'icons-12',
    folder: '12',
  },
  '3227:1083': {
    name: 'social',
    folder: 'social',
  },
  '942:77': {
    name: 'reactions',
    folder: 'reactions',
  },
}

const figma = new Figma.Api({
  personalAccessToken,
})

const s1 = spinner()
s1.start('Fetching Figma file nodes')
const { nodes } = await figma.getFileNodes(FILE_KEY, Object.keys(NODE_IDS))
// console.log('🚀 ~ nodes:', nodes)

s1.stop('Done!')

for (const [nodeId, { name, folder }] of Object.entries(NODE_IDS)) {
  const s2 = spinner()
  s2.start(`Fetching SVG images for ${name}`)

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

  log.info(`Generating SVGs for ${name}`)

  await pMap(
    Object.entries(images),
    async ([nodeId, image]) => {
      const icon = components[nodeId]!
      const svgRaw = await fetch(image!)
        .then(res => res.text())
        .catch(() => {
          log.error(`Failed to fetch SVG for ${icon.name}`)
          return
        })

      // note: probably a wrapper layer for https://www.figma.com/file/qLLuMLfpGxK9OfpIavwsmK/Iconset?type=design&node-id=4408-955&mode=dev, thus skipping
      // icon:: {
      //   key: 'c73f7bad669c2696c2158cef34967a20cc0f0f0f',
      //   name: 'Use=Default, Typo=False, Style=Gradient',
      //   description: '',
      //   remote: true,
      //   componentSetId: '4819:992',
      //   documentationLinks: []
      // }
      // raw::
      // transform::
      // icon:: {
      //   key: '53e1bc9f7ee455bc6cc38b90a9b7614ef64afe4e',
      //   name: '20/status-logo',
      //   description: '',
      //   remote: false,
      //   documentationLinks: []
      // }
      if (!svgRaw) {
        log.error(`Failed to fetch SVG for ${icon.name}`)
        return
      }

      const svg = await transform(svgRaw, {
        plugins: ['@svgr/plugin-svgo'],
        replaceAttrValues: {
          '#09101C': 'currentColor',
          '#2A4AF5': 'var(--customisation-50, #2A4AF5)',
        },
        svgProps: {
          'aria-hidden': '{true}',
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
            'prefixIds',
          ],
        },
      })

      const nameParts = icon.name.replace(' / ', '/').split('/')
      const iconName = nameParts.at(-1)!
      const fileName = `${toKebabCase(iconName)}-icon.svg`
      const filePath = path.resolve(SVG_DIR, folder, fileName)

      await fs.ensureDir(path.dirname(filePath))

      await fs.writeFile(filePath, svg, { encoding: 'utf8' })

      log.success(filePath)
    },
    { concurrency: 5 }
  )

  log.success(`${Object.keys(images).length} SVGs generated`)
}
