import { NotFoundContent } from '~website/_components/not-found-content'

import messages from '../../../messages/en.json'
import WebsiteLayout from '../../website/layout'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: messages.metadata.notFoundTitle,
  description: messages.metadata.notFoundDescription,
  robots: { index: false },
}

export default function NotFound() {
  return (
    <WebsiteLayout>
      <NotFoundContent />
    </WebsiteLayout>
  )
}
