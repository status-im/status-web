import fs from 'fs/promises'
import path from 'path'
import { legalComponents } from '~/app/_components/content'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

const frontmatterSchema = z.object({
  title: z.string().optional(),
})

const EXTERNAL_DOCUMENTS = ['status-network-pre-deposit-disclaimer'] as const

type ExternalDocument = (typeof EXTERNAL_DOCUMENTS)[number]

type LocalDocument = 'privacy-policy' | 'terms-of-use'

type DocumentName = LocalDocument | ExternalDocument

const externalDocumentSet = new Set<string>(EXTERNAL_DOCUMENTS)

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
    ? path.resolve(`content/legal-external/${documentName}.md`)
    : path.resolve(`content/legal/${documentName}.md`)

  const [fileContent, { mtime: lastEdited }] = await Promise.all([
    fs.readFile(filePath, 'utf8'),
    fs.stat(filePath),
  ])

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
