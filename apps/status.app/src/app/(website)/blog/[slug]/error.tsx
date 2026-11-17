'use client'

import { Body } from '~components/body'
import { BlogEmptyState } from '~website/blog/_components/blog-empty-state'

export default function BlogPostError() {
  return (
    <Body>
      <BlogEmptyState postsUnavailable />
    </Body>
  )
}
