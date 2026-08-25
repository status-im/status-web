import { redirect } from 'next/navigation'

import { CanonicalMetadata } from '~app/_metadata'

// This route renders no content of its own, so it points at the page it hands
// off to rather than leaving the hand-off without a canonical.
export const metadata = CanonicalMetadata('/insights/epics')

export default function InsightsPage() {
  return redirect('/insights/epics')
}
