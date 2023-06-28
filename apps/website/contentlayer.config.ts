import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from '@contentlayer/source-files'
import remarkHeadings from '@vcarl/remark-headings'
import { slug as slugify } from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { remark } from 'remark'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
// import remarkMessageControl from 'remark-message-control'
// import remarkAdmonitions from 'remark-github-beta-blockquote-admonitions'
// import remarkBreaks from 'remark-breaks'
import strip from 'strip-markdown'
import { visit } from 'unist-util-visit'

import type { Plugin } from 'unified'
import type { Node } from 'unist'

const CONTENT_DIR_PATH = 'docs'

export type DocHeading = {
  level: 1 | 2
  value: string
}

export type DocIndex = {
  path: string
  title: string
  content: {
    [key in string]: string[]
  }
}

const HeroImage = defineNestedType(() => ({
  name: 'HeroImage',
  fields: {
    src: { type: 'string', required: true },
    alt: { type: 'string', required: true },
  },
}))

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: '**/*.md{,x}',
  contentType: 'mdx',

  fields: {
    id: { type: 'number', required: false },
    revision: { type: 'string', required: false },
    language: { type: 'string', required: false },
    title: { type: 'string', required: true },
    author: { type: 'string', required: false },
    image: { type: 'nested', of: HeroImage, required: false },
  },

  computedFields: {
    slug: {
      // @ts-expect-error TODO
      type: 'string[]',
      resolve: doc => doc._raw.flattenedPath.split('/'),
      // resolve: doc => {
      //   return getPathSegments(doc._raw.flattenedPath).map(
      //     ({ pathName }) => pathName
      //   )
      // },
    },
    url: {
      type: 'string',
      resolve: doc => `/help/${doc._raw.flattenedPath}`,

      // resolve: doc => {
      //   const slug = getPathSegments(doc._raw.flattenedPath).map(
      //     ({ pathName }) => pathName
      //   )

      //   return `/help/${slug.join('/')}`
      // },
    },
    pathSegments: {
      // @ts-expect-error TODO
      type: '{ order: number; pathName: string }[]',
      resolve: doc => getPathSegments(doc._raw.flattenedPath),
    },

    titleSlug: {
      type: 'string',
      resolve: doc => slugify(doc.title),
    },

    headings: {
      // @ts-expect-error TODO
      type: '{ level: 1 | 2; value: string, slug: string }[]',
      resolve: async doc => {
        const result = await remark().use(remarkHeadings).process(doc.body.raw)

        return (result.data.headings as { depth: number; value: string }[])
          .filter(({ depth }) => [1, 2].includes(depth))
          .map<DocHeading>(({ depth, value }) => ({
            level: depth as 1 | 2,
            value,
            slug: slugify(value),
          }))
      },
    },
    last_edited: {
      type: 'date',
      resolve: async (doc): Promise<Date> => {
        const stats = await fs.stat(
          path.join(CONTENT_DIR_PATH, doc._raw.sourceFilePath)
        )
        return stats.mtime
      },
    },
  },
}))

function getPathSegments(filePath: string) {
  return (
    filePath
      .split('/')
      // .slice(1) // skip content dir path – `/docs`
      .map(fileName => {
        const re = /^((\d+)-)?(.*)$/
        const [, , orderStr, pathName] = fileName.match(re) ?? []
        const order = orderStr ? parseInt(orderStr) : 0
        return { order, pathName }
      })
  )
}

const remarkAdmonition: Plugin = () => {
  return tree => {
    visit(tree, node => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        // @ts-expect-error TODO
        if (!['info', 'tip', 'warn'].includes(node.name)) {
          return
        }

        // Store node.name before overwritten with "Alert".
        // @ts-expect-error TODO
        const type = node.name

        // const data = node.data || (node.data = {})
        // const tagName = node.type === 'textDirective' ? 'span' : 'div'

        node.type = 'mdxJsxFlowElement'
        // @ts-expect-error TODO
        node.name = 'Admonition'
        // @ts-expect-error TODO
        node.attributes = [
          { type: 'mdxJsxAttribute', name: 'type', value: type },
          // @ts-expect-error TODO
          { type: 'mdxJsxAttribute', name: 'title', value: node.label },
        ]
      }
    })
  }
}

const remarkIndexer: Plugin = () => (root, file) => {
  file.data.index = indexer(root)
}

function indexer(root: Node) {
  const index: DocIndex['content'] = {}

  let parentHeading = ''
  visit(root, ['paragraph', 'heading'], node => {
    if (node.type === 'heading') {
      const text = toString(node, { includeImageAlt: false })
      parentHeading = text
      return
    }

    const text = toString(node, { includeImageAlt: false })
    index[parentHeading] ??= []
    index[parentHeading].push(text)
  })

  return index
}

export default makeSource({
  contentDirPath: CONTENT_DIR_PATH,
  documentTypes: [Doc],
  mdx: {
    remarkPlugins: [
      remarkGfm,
      remarkDirective,
      remarkAdmonition,
      // [remarkMessageControl, { name: 'hello' }],
    ],
    rehypePlugins: [
      rehypeSlug,

      [
        rehypePrettyCode,
        {
          // Use one of Shiki's packaged themes
          theme: 'github-light',
          // Keep the background or use a custom background color?
          // keepBackground: true,
          // Callback hooks to add custom logic to nodes when visiting
          // them.
          onVisitLine(node: any) {
            // Prevent lines from collapsing in `display: grid` mode, and
            // allow empty lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node: any) {
            // Each line node by default has `class="line"`.
            node.properties.className.push('highlighted')
          },
          onVisitHighlightedWord(node: any) {
            // Each word node has no className by default.
            node.properties.className = ['word']
          },
        },
      ],
    ],
  },
  onSuccess: async importData => {
    const { allDocs } = await importData()

    const basePath = '/docs'
    const index: DocIndex[] = []

    for (const doc of allDocs) {
      const result = await remark()
        .use(strip, {
          keep: ['heading'],
        })
        .use(remarkGfm)
        .use(remarkIndexer, { path: basePath + '/' + doc._raw.flattenedPath })
        .process(doc.body.raw)

      index.push({
        title: doc.title,
        path: basePath + '/' + doc._raw.flattenedPath,
        content: result.data.index as DocIndex['content'],
      })
    }

    const filePath = path.resolve('./.contentlayer/en.json')

    fs.writeFile(filePath, JSON.stringify(index))
  },
})
