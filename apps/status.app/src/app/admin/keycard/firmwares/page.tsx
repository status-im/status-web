import { EmptyState } from '~admin/_components/empty-state'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Firmwares',
}

export default function FirmwaresPage() {
  return <EmptyState variant="firmwares" />
}
