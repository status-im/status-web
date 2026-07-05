import { compileMDX } from 'next-mdx-remote/rsc'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

import { legalComponents } from '~components/legal-content'

import { getLegalLastEdited } from './get-legal-last-edited'
import { type DocumentName, externalDocumentSet } from './legal-documents'

const statusNetworkRoot = path.join(process.cwd(), '../status.network')

const frontmatterSchema = z.object({
  title: z.string().optional(),
})

function extractTitleFromHeadline(content: string): {
  title: string | undefined
  contentWithoutTitle: string
} {
  const match = content.match(/^#\s+(.+)$/m)
  if (!match) {
    return { title: undefined, contentWithoutTitle: content }
  }

  const title = match[1].trim()
  const contentWithoutTitle = content.replace(/^#\s+.+\n*/m, '')

  return { title, contentWithoutTitle }
}

export async function getLegalDocumentContent(documentName: DocumentName) {
  const isExternal = externalDocumentSet.has(documentName)
  const filePath = isExternal
    ? path.join(
        statusNetworkRoot,
        'content/legal-external',
        `${documentName}.md`
      )
    : path.join(statusNetworkRoot, 'content/legal', `${documentName}.md`)

  const fileContent = await fs.readFile(filePath, 'utf8')
  const lastEdited = getLegalLastEdited(documentName)

  const { title: extractedTitle, contentWithoutTitle } =
    extractTitleFromHeadline(fileContent)

  const { frontmatter, content } = await compileMDX<
    z.infer<typeof frontmatterSchema>
  >({
    source: contentWithoutTitle,
    components: legalComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
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

  const title = result.data.title ?? extractedTitle

  if (!title) {
    throw new Error(`Missing title for document: ${documentName}`)
  }

  return {
    meta: {
      title,
      lastEdited,
    },
    content,
  }
}
