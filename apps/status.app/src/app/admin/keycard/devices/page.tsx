import { EmptyState } from '~admin/_components/empty-state'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devices',
}

export default function DevicesPage() {
  return <EmptyState variant="devices" />
}
