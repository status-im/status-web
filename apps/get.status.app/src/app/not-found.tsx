import { NotFoundContent } from '~website/_components/not-found-content'

import messages from '../../messages/en.json'
import WebsiteLayout from '../website/layout'

import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: messages.metadata.notFoundTitle,
  description: messages.metadata.notFoundDescription,
  robots: { index: false },
}

// Fallback for routes outside `[locale]` during static export.
export default function NotFound() {
  return (
    <WebsiteLayout>
      <NotFoundContent />
    </WebsiteLayout>
  )
}
