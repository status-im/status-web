import { EmptyState } from '~admin/_components/empty-state'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
}

export default function ProjectsPage() {
  return <EmptyState variant="projects" />
}
