import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'
import rehypeParse from 'rehype-parse'
import { unified } from 'unified'

import { listedArchivePosts } from '../src/app/(website)/_lib/blog-archive'
import { getArchivedArticle } from '../src/app/(website)/_lib/blog-archive/articles'
import { createBlogSearchPayload } from '../src/app/(website)/blog/_utils/search'

// Keep the output path in sync with the static file tracing in search.server.ts.
const OUTPUT_PATH = 'public/blog-search-index.json'

type ContentNode = {
  type: string
  value?: string
  children?: ContentNode[]
}

function textContent(node: ContentNode): string {
  if (node.type === 'text') return node.value ?? ''
  return node.children?.map(textContent).join(' ') ?? ''
}

async function main() {
  const parser = unified().use(rehypeParse, { fragment: true })
  const posts = listedArchivePosts.map(post => ({
    ...post,
    plaintext: textContent(parser.parse(getArchivedArticle(post.slug).html)),
  }))
  const payload = createBlogSearchPayload(posts)

  await writeFile(path.join(cwd(), OUTPUT_PATH), JSON.stringify(payload))
  console.log(`Generated blog search index for ${posts.length} posts`)
}

void main()
