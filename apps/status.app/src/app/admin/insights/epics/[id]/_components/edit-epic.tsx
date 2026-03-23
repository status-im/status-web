'use client'

import { useToast } from '@status-im/components'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { AdminLayoutDetailEdit } from '~admin/_layouts/admin-layout-detail-edit'

import { deleteEpic, updateEpic } from '../../_actions'
import { EpicForm } from '../../_components/epic-form'

import type { AdminLayoutDetailEditProps } from '~admin/_layouts/admin-layout-detail-edit'
import type { ApiOutput } from '~server/api/types'

type Props = {
  epic: ApiOutput['epics']['byId']
  breadcrumbs: AdminLayoutDetailEditProps['breadcrumbs']
}

export const EditEpic = (props: Props) => {
  const { epic, breadcrumbs } = props

  const router = useRouter()
  const toast = useToast()
  const t = useTranslations('admin')

  const handleDelete = async () => {
    await deleteEpic(epic.id)
    toast.positive(t('epicRemoved'))
    router.push('/admin/insights/epics')
  }

  return (
    <AdminLayoutDetailEdit title={t('editEpic')} breadcrumbs={breadcrumbs}>
      <EpicForm
        variant="edit"
        defaultValues={{
          name: epic.name,
          description: epic.description,
          color: epic.color,
          status: epic.status,
        }}
        onSubmit={values => updateEpic({ id: epic.id, values })}
      />
      <AdminLayoutDetailEdit.DangerZone
        actionLabel={t('deleteEpic')}
        onConfirm={handleDelete}
      />
    </AdminLayoutDetailEdit>
  )
}
