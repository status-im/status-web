import { EmptyState } from '~admin/_components/empty-state'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workstreams',
}

export default function WorkstreamsPage() {
  return <EmptyState variant="workstreams" />
}
