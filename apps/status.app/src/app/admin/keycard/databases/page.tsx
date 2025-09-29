import { EmptyState } from '~admin/_components/empty-state'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Databases',
}

export default function DatabasesPage() {
  return <EmptyState variant="databases" />
}
