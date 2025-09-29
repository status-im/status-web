import { EmptyState } from '~admin/_components/empty-state'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Releases',
}

export default function ReleasesPage() {
  return <EmptyState variant="releases" />
}
