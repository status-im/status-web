import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from '@contentlayer/source-files'
import remarkHeadings from '@vcarl/remark-headings'
// import { toc } from 'mdast-util-toc'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkAdmonitions from 'remark-github-beta-blockquote-admonitions'

// const remarkBreaks = require('remark-breaks')
// const remarkDirective = require('remark-directive')

const CONTENT_DIR_PATH = 'docs'

export type DocHeading = { level: 1 | 2 | 3; value: string }

const HeroImage = defineNestedType(() => ({
  name: 'HeroImage',
  fields: {
    src: { type: 'string', required: true },
    alt: { type: 'string', required: true },
  },
}))

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `**/*.md`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    image: { type: 'nested', of: HeroImage, required: false },
  },
  computedFields: {
    slug: {
      // @ts-expect-error TODO
      type: 'string[]',
      resolve: doc => doc._raw.flattenedPath.split('/'),
    },
    url: {
      type: 'string',
      resolve: doc => `/learn/${doc._raw.flattenedPath}`,
    },
    pathSegments: {
      type: 'json',
      resolve: doc =>
        doc._raw.flattenedPath
          .split('/')
          // skip `/docs` prefix
          .slice(1)
          .map(dirName => {
            const re = /^((\d+)-)?(.*)$/
            const [, , orderStr, pathName] = dirName.match(re) ?? []
            const order = orderStr ? parseInt(orderStr) : 0
            return { order, pathName }
          }),
    },
    headings: {
      // @ts-expect-error TODO
      type: '{ level: 1 | 2 | 3; value: string }[]',
      resolve: async doc => {
        const result = await remark().use(remarkHeadings).process(doc.body.raw)
        return (
          result.data.headings as { depth: number; value: string }[]
        ).map<DocHeading>(({ depth, value }) => ({
          level: depth as DocHeading['level'],
          value,
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

export default makeSource({
  contentDirPath: CONTENT_DIR_PATH,
  documentTypes: [Doc],
  mdx: {
    remarkPlugins: [remarkGfm, remarkAdmonitions],
  },
})
