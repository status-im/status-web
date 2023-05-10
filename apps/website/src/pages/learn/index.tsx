import { AppLayout } from '@/layouts/app-layout'

import type { Page } from 'next'

const BlogPage: Page = () => {
  return (
    <div>
      <h1>Blog</h1>
    </div>
  )
}

BlogPage.getLayout = AppLayout

export default BlogPage
