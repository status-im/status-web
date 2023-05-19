import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from '@contentlayer/source-files'
// import { toc } from 'mdast-util-toc'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import remarkGfm from 'remark-gfm'
import remarkAdmonitions from 'remark-github-beta-blockquote-admonitions'
import remarkToc from 'remark-toc'

// const remarkBreaks = require('remark-breaks')
// const remarkDirective = require('remark-directive')
// const remarkFrontmatter = require('remark-frontmatter')
// const remarkGfm = require('remark-gfm')
// const remarkAdmonitions = require('remark-github-beta-blockquote-admonitions')

const contentDirPath = 'docs'

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
    toc: {
      type: 'json',
      resolve: doc => {
        console.log('DOCS', doc.body.code)

        return {}
      },
    },

    last_edited: {
      type: 'date',
      resolve: async (doc): Promise<Date> => {
        const stats = await fs.stat(
          path.join(contentDirPath, doc._raw.sourceFilePath)
        )
        return stats.mtime
      },
    },
  },
}))

export default makeSource({
  contentDirPath,
  documentTypes: [Doc],
  mdx: {
    remarkPlugins: [remarkGfm, remarkToc, remarkAdmonitions],
  },
})
