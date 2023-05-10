import { AppLayout } from '@/layouts/app-layout'

import type { Page } from 'next'

const BlogDetailPage: Page = () => {
  return (
    <div>
      <h1>Blog</h1>
    </div>
  )
}

BlogDetailPage.getLayout = AppLayout

export default BlogDetailPage
