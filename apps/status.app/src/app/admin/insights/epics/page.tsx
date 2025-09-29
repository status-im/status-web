import { EmptyState } from '~admin/_components/empty-state'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Epics',
}

export default function EpicsPage() {
  return <EmptyState variant="epics" />
}
