import { EmptyState } from '~admin/_components/empty-state'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reporting',
}

export default function ReportingSubPage() {
  return <EmptyState variant="reports" />
}
