import { getTranslations } from 'next-intl/server'

import { AdminLayoutDetailEdit } from '~admin/_layouts/admin-layout-detail-edit'

import { createEpic } from '../_actions'
import { EpicForm } from '../_components/epic-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New epic',
}

export default async function NewEpicPage() {
  const t = await getTranslations('admin')
  const breadcrumbs = [
    {
      label: t('epics'),
      href: '/admin/insights/epics',
    },
    {
      label: t('newEpic'),
      href: `/admin/insights/epics/new`,
    },
  ]

  return (
    <AdminLayoutDetailEdit title={t('newEpic')} breadcrumbs={breadcrumbs}>
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
