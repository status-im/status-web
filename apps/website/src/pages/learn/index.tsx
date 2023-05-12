import { AppLayout } from '@/layouts/app-layout'

import type { Page } from 'next'

const LearnPage: Page = () => {
  return (
    <div>
      <h1>Learn</h1>
    </div>
  )
}

LearnPage.getLayout = AppLayout

export default LearnPage
