import { AdminLayoutDetailEdit } from '~admin/_layouts/admin-layout-detail-edit'

import { createWorkstream } from '../_actions'
import { WorkstreamForm } from '../_components/workstream-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New workstream',
}

const breadcrumbs = [
  {
    label: 'Workstreams',
    href: '/admin/insights/workstreams',
  },
  {
    label: 'New workstream',
    href: `/admin/insights/workstream/new`,
  },
]

export default async function NewWorkstreamPage() {
  return (
    <AdminLayoutDetailEdit title="New workstream" breadcrumbs={breadcrumbs}>
      <WorkstreamForm
        variant="create"
        defaultValues={{
          emoji: '🔥',
          name: '',
          description: '',
          color: '',
        }}
        onSubmit={createWorkstream}
      />
    </AdminLayoutDetailEdit>
  )
}
