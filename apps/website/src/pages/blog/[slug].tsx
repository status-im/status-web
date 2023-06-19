import { AppLayout } from '@/layouts/app-layout'

import type { Page } from 'next'

const BlogDetailPage: Page = () => {
  return (
    <div>
      <h1>Blog</h1>
    </div>
  )
}

BlogDetailPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default BlogDetailPage
