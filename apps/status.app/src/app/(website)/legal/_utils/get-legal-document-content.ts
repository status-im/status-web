// todo: abstract after review
import 'server-only'

import fs from 'fs/promises'
import { compileMDX } from 'next-mdx-remote/rsc'
import path from 'path'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkComment from 'remark-comment'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm-v4'
import { z } from 'zod'

import {
  helpComponents,
  legalComponents,
  specsComponents,
} from '~components/content'
import { remarkRawDocumentData } from '~website/(content)/_lib/plugins/remark-raw-document-data'
import { remarkRewriteLinks } from '~website/(content)/_lib/plugins/remark-rewrite-links'

const frontmatterSchema = z.object({
  title: z.string(),
})

export async function getLegalDocumentContent(documentName: string) {
  const filePath = path.resolve(`content/${documentName}`)

  const [fileContent, { mtime: lastEdited }] = await Promise.all([
    fs.readFile(filePath, 'utf8'),
    fs.stat(filePath),
  ])

  const { frontmatter, content } = await compileMDX<
    z.infer<typeof frontmatterSchema>
  >({
    source: {
      path: filePath,
      value: fileContent,
    },
    components: { ...legalComponents, ...helpComponents, ...specsComponents },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug as any,
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              keepBackground: false,
            },
          ],
        ],
        remarkPlugins: [
          [remarkRawDocumentData, { path: filePath, dir: 'content' }],
          remarkComment as any,
          remarkGfm,
          remarkDirective,
          remarkRewriteLinks,
        ],
      },
    },
  })

  const result = frontmatterSchema.safeParse(frontmatter)

  if (!result.success) {
    const errorMessage = result.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ')

    throw new Error(`Invalid metadata: ${errorMessage}`)
  }

  return {
    meta: {
      ...result.data,
      lastEdited,
    },
    content,
  }
}
