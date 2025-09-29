import fs from 'fs/promises'
import path from 'path'
import { legalComponents } from '~/app/_components/content'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import { z } from 'zod'

const frontmatterSchema = z.object({
  title: z.string(),
})

export async function getLegalDocumentContent(
  documentName: 'privacy-policy' | 'terms-of-use',
) {
  const filePath = path.resolve(`content/legal/${documentName}.md`)

  const [fileContent, { mtime: lastEdited }] = await Promise.all([
    fs.readFile(filePath, 'utf8'),
    fs.stat(filePath),
  ])

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

  return {
    meta: {
      ...result.data,
      lastEdited,
    },
    content,
  }
}
