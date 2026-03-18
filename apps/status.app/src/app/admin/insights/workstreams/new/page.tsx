import { getTranslations } from 'next-intl/server'

import { AdminLayoutDetailEdit } from '~admin/_layouts/admin-layout-detail-edit'

import { createWorkstream } from '../_actions'
import { WorkstreamForm } from '../_components/workstream-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New workstream',
}

export default async function NewWorkstreamPage() {
  const t = await getTranslations('admin')
  const breadcrumbs = [
    {
      label: t('workstreams'),
      href: '/admin/insights/workstreams',
    },
    {
      label: t('newWorkstream'),
      href: `/admin/insights/workstream/new`,
    },
  ]

  return (
    <AdminLayoutDetailEdit title={t('newWorkstream')} breadcrumbs={breadcrumbs}>
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
