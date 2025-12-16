import fs from 'fs/promises'
import path from 'path'
import { legalComponents } from '~/app/_components/content'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import { z } from 'zod'

const frontmatterSchema = z.object({
  title: z.string().optional(),
})

function extractTitleFromContent(content: string): string | undefined {
  const match = content.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim()
}

type DocumentName =
  | 'privacy-policy'
  | 'terms-of-use'
  | 'status-network-pre-deposit-disclaimer'

const REMOTE_DOCUMENTS: Partial<
  Record<DocumentName, { url: string; title: string }>
> = {
  'status-network-pre-deposit-disclaimer': {
    url: 'https://raw.githubusercontent.com/status-im/status-software-legal-documents/master/status-network-pre-deposit-disclaimer.md',
    title: 'Status Network Pre-Deposit Disclaimer',
  },
}

async function getRemoteContent(url: string): Promise<{
  content: string
  lastEdited: Date
}> {
  const response = await fetch(url, { next: { revalidate: 3600 } })

  if (!response.ok) {
    throw new Error(`Failed to fetch remote document: ${response.statusText}`)
  }

  const content = await response.text()
  const lastModified = response.headers.get('last-modified')

  return {
    content,
    lastEdited: lastModified ? new Date(lastModified) : new Date(),
  }
}

async function getLocalContent(documentName: string): Promise<{
  content: string
  lastEdited: Date
}> {
  const filePath = path.resolve(`content/legal/${documentName}.md`)

  const [content, { mtime: lastEdited }] = await Promise.all([
    fs.readFile(filePath, 'utf8'),
    fs.stat(filePath),
  ])

  return { content, lastEdited }
}

export async function getLegalDocumentContent(documentName: DocumentName) {
  const remoteDocument = REMOTE_DOCUMENTS[documentName]

  const { content: fileContent, lastEdited } = remoteDocument
    ? await getRemoteContent(remoteDocument.url)
    : await getLocalContent(documentName)

  const { frontmatter, content } = await compileMDX<
    z.infer<typeof frontmatterSchema>
  >({
    source: fileContent,
    components: legalComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
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

  const title =
    result.data.title ??
    remoteDocument?.title ??
    extractTitleFromContent(fileContent) ??
    documentName

  return {
    meta: {
      title,
      lastEdited,
    },
    content,
  }
}
