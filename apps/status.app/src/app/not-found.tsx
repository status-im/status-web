import { NotFoundContent } from '~website/_components/not-found-content'
import WebsiteLayout from '~website/layout'

import { Metadata } from './_metadata'

export const metadata = Metadata({
  title: '404 — Page Not Found',
  description:
    'The page you were looking for could not be found. Return to the Status homepage.',
  robots: {
    index: false,
  },
})

export default function NotFound() {
  return (
    <WebsiteLayout>
      <NotFoundContent />
    </WebsiteLayout>
  )
}
