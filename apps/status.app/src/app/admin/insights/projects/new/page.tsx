import { getTranslations } from 'next-intl/server'

import { AdminLayoutDetailEdit } from '~admin/_layouts/admin-layout-detail-edit'

import { NewProject } from './_components/new-project'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New project',
}

export default async function NewProjectPage() {
  const t = await getTranslations('admin')
  const breadcrumbs = [
    {
      label: t('projects'),
      href: '/admin/insights/projects',
    },
    {
      label: t('newProject'),
      href: `/admin/insights/project/new`,
    },
  ]

  return (
    <AdminLayoutDetailEdit title={t('newProject')} breadcrumbs={breadcrumbs}>
      <NewProject />
    </AdminLayoutDetailEdit>
  )
}
