'use client'

import { Button, useToast } from '@status-im/components'
import { EditIcon } from '@status-im/icons/12'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { AddNewButton } from '~admin/_components/add-new-button'
import { AdminLayoutDetailEdit } from '~admin/_layouts/admin-layout-detail-edit'

import { EditMilestoneDrawer } from '../../../_components/edit-milestone-drawer'
import { MilestonesStatusGroupList } from '../../../_components/milestones-status-group-list'
import { StatusGroupHeader } from '../../../_components/status-group-header'
import {
  createProjectMilestone,
  deleteProject,
  updateProject,
  updateProjectMilestone,
} from '../../_actions'
import { ProjectForm } from '../../_components/project-form'

import type { AdminLayoutDetailEditProps } from '~admin/_layouts/admin-layout-detail-edit'
import type { ApiOutput } from '~server/api/types'

type Props = {
  project: ApiOutput['projects']['byId']
  epics: ApiOutput['epics']['all']
  breadcrumbs: AdminLayoutDetailEditProps['breadcrumbs']
}

const EditProject = (props: Props) => {
  const { project, epics, breadcrumbs } = props

  const router = useRouter()
  const toast = useToast()
  const t = useTranslations('admin')

  const handleDelete = async () => {
    await deleteProject(project.id)
    toast.positive(t('projectRemoved'))
    router.push('/admin/insights/projects')
  }

  return (
    <AdminLayoutDetailEdit title={t('editProject')} breadcrumbs={breadcrumbs}>
      <ProjectForm
        variant="edit"
        defaultValues={{
          name: project.name,
          description: project.description,
          app: project.app,
        }}
        onSubmit={async values => {
          await updateProject({ id: project.id, values })
          router.push('/admin/insights/projects')
          toast.positive(t('projectUpdated'))
        }}
      />

      <AdminLayoutDetailEdit.Separator />

      <StatusGroupHeader
        title={t('milestones')}
        description={t('manageMilestones')}
      >
        <EditMilestoneDrawer
          epics={epics}
          title={t('addMilestone')}
          defaultValues={{
            name: '',
            description: '',
            epicIds: [],
            links: [],
          }}
          onSubmit={async values => {
            await createProjectMilestone({
              projectId: project.id,
              milestone: values,
            })
            router.refresh()
          }}
          successMessage={t('milestoneAdded')}
        >
          <AddNewButton>{t('newMilestone')}</AddNewButton>
        </EditMilestoneDrawer>
      </StatusGroupHeader>

      <MilestonesStatusGroupList
        milestones={project.milestones}
        cardFooterType="epics"
        cardAction={milestone => (
          <EditMilestoneDrawer
            title={t('editMilestone')}
            milestoneId={milestone.id}
            onSubmit={async values => {
              await updateProjectMilestone({
                milestoneId: milestone.id,
                values,
              })
            }}
            successMessage={t('milestoneEdited')}
            epics={epics}
            defaultValues={{
              description: milestone.description,
              name: milestone.name,
              epicIds: milestone.epics.map(epic => epic.id),
              links: [],
            }}
          >
            <Button
              size="24"
              variant="outline"
              icon={<EditIcon />}
              aria-label={t('editMilestone')}
            />
          </EditMilestoneDrawer>
        )}
      />

      <AdminLayoutDetailEdit.DangerZone
        actionLabel={t('deleteProject')}
        onConfirm={handleDelete}
      />
    </AdminLayoutDetailEdit>
  )
}

export { EditProject }
