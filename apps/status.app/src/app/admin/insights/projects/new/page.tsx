import { AdminLayoutDetailEdit } from '~admin/_layouts/admin-layout-detail-edit'

import { NewProject } from './_components/new-project'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New project',
}

const breadcrumbs = [
  {
    label: 'Projects',
    href: '/admin/insights/projects',
  },
  {
    label: 'New project',
    href: `/admin/insights/project/new`,
  },
]

export default function NewProjectPage() {
  return (
    <AdminLayoutDetailEdit title="New project" breadcrumbs={breadcrumbs}>
      <NewProject />
    </AdminLayoutDetailEdit>
  )
}
