import production from 'react/jsx-runtime'
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import { markdownComponents as components } from '@/components/content/markdown'

import type { ReactElement } from 'react'

export const renderMarkdown = async (
  markdown: string,
): Promise<ReactElement> => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    // @ts-expect-error - rehype-react types are not compatible with unified types
    .use(rehypeReact, {
      ...production,
      components,
    })
    .process(markdown)
  return result.result as ReactElement
}
