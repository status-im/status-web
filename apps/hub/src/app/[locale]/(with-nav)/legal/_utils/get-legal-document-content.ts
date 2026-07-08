import { compileMDX } from 'next-mdx-remote/rsc'
import fs from 'node:fs/promises'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

import { legalComponents } from '~components/legal-content'

import { getLegalDocumentPath } from './get-legal-document-path'
import { getLegalLastEdited } from './get-legal-last-edited'
import { type DocumentName } from './legal-documents'

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
  const filePath = getLegalDocumentPath(documentName)

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
