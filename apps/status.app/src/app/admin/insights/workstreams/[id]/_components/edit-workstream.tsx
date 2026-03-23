'use client'

import { useEffect, useState } from 'react'

import { Button, useToast } from '@status-im/components'
import { DeleteIcon } from '@status-im/icons/12'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { AddNewButton } from '~admin/_components/add-new-button'
import { AlertDialog } from '~admin/_components/alert-dialog'
import { AdminLayoutDetailEdit } from '~admin/_layouts/admin-layout-detail-edit'

import { StatusGroupHeader } from '../../../_components/status-group-header'
import {
  deleteWorkstream,
  removeWorkstreamProject,
  updateWorkstream,
  updateWorkstreamProjects,
} from '../../_actions'
import { AddProjectsDrawer } from '../../_components/add-projects-drawer'
import { ProjectsStatusGroupList } from '../../_components/projects-status-group-list'
import { WorkstreamForm } from '../../_components/workstream-form'

import type { AdminLayoutDetailEditProps } from '~admin/_layouts/admin-layout-detail-edit'
import type { ApiOutput } from '~server/api/types'

type Props = {
  workstream: ApiOutput['workstreams']['byId']
  projects: ApiOutput['projects']['all']
  breadcrumbs: AdminLayoutDetailEditProps['breadcrumbs']
}

export const EditWorkstream = (props: Props) => {
  const { workstream, projects, breadcrumbs } = props

  const router = useRouter()
  const toast = useToast()
  const t = useTranslations('admin')

  const handleDelete = async () => {
    await deleteWorkstream(workstream.id)
    toast.positive(t('workstreamRemoved'))
    router.push('/admin/insights/workstreams')
  }

  const [projectIds, setProjectIds] = useState<number[]>(() =>
    workstream.projects.map(p => p.id)
  )

  useEffect(() => {
    setProjectIds(workstream.projects.map(p => p.id))
  }, [workstream.projects])

  return (
    <AdminLayoutDetailEdit
      title={t('editWorkstream')}
      breadcrumbs={breadcrumbs}
    >
      <WorkstreamForm
        variant="edit"
        defaultValues={{
          emoji: workstream.emoji,
          name: workstream.name,
          description: workstream.description,
          color: workstream.color,
        }}
        onSubmit={values => updateWorkstream({ id: workstream.id, values })}
      />

      <AdminLayoutDetailEdit.Separator />

      <StatusGroupHeader
        title={t('projects')}
        description={t('manageProjects')}
      >
        <AddProjectsDrawer
          projects={projects}
          selection={projectIds}
          onSelectionChange={setProjectIds}
          onSubmit={async () =>
            await updateWorkstreamProjects({ id: workstream.id, projectIds })
          }
        >
          <AddNewButton>{t('addProjects')}</AddNewButton>
        </AddProjectsDrawer>
      </StatusGroupHeader>

      <ProjectsStatusGroupList
        projects={workstream.projects}
        cardAction={project => (
          <AlertDialog
            title={t('removeProject')}
            onConfirm={async () => {
              await removeWorkstreamProject({
                workstreamId: workstream.id,
                projectId: project.id,
              })
            }}
          >
            <Button
              variant="outline"
              size="24"
              icon={<DeleteIcon />}
              aria-label={t('removeProject')}
            />
          </AlertDialog>
        )}
      />

      <AdminLayoutDetailEdit.DangerZone
        actionLabel={t('deleteWorkstream')}
        onConfirm={handleDelete}
      />
    </AdminLayoutDetailEdit>
  )
}
