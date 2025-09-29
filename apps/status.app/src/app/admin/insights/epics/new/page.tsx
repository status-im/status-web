import { AdminLayoutDetailEdit } from '~admin/_layouts/admin-layout-detail-edit'

import { createEpic } from '../_actions'
import { EpicForm } from '../_components/epic-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New epic',
}

const breadcrumbs = [
  {
    label: 'Epics',
    href: '/admin/insights/epics',
  },
  {
    label: 'New epic',
    href: `/admin/insights/epics/new`,
  },
]

export default async function NewEpicPage() {
  return (
    <AdminLayoutDetailEdit title="New epic" breadcrumbs={breadcrumbs}>
      <EpicForm
        variant="create"
        defaultValues={{
          name: '',
          description: '',
          color: '',
          status: 'not-started',
        }}
        onSubmit={createEpic}
      />
    </AdminLayoutDetailEdit>
  )
}
