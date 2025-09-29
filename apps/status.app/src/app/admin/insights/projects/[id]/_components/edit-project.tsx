'use client'

import { Button, useToast } from '@status-im/components'
import { EditIcon } from '@status-im/icons/12'
import { useRouter } from 'next/navigation'

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

  const handleDelete = async () => {
    await deleteProject(project.id)
    toast.positive('Project removed successfully')
    router.push('/admin/insights/projects')
  }

  return (
    <AdminLayoutDetailEdit title="Edit project" breadcrumbs={breadcrumbs}>
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
          toast.positive('Project updated successfully')
        }}
      />

      <AdminLayoutDetailEdit.Separator />

      <StatusGroupHeader
        title="Milestones"
        description="Add, view, and manage milestones."
      >
        <EditMilestoneDrawer
          epics={epics}
          title="Add milestone"
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
          successMessage="Milestone added successfully"
        >
          <AddNewButton>New milestone</AddNewButton>
        </EditMilestoneDrawer>
      </StatusGroupHeader>

      <MilestonesStatusGroupList
        milestones={project.milestones}
        cardFooterType="epics"
        cardAction={milestone => (
          <EditMilestoneDrawer
            title="Edit Milestone"
            milestoneId={milestone.id}
            onSubmit={async values => {
              await updateProjectMilestone({
                milestoneId: milestone.id,
                values,
              })
            }}
            successMessage="Milestone edited successfully"
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
              aria-label="Edit milestone"
            />
          </EditMilestoneDrawer>
        )}
      />

      <AdminLayoutDetailEdit.DangerZone
        actionLabel="Delete project"
        onConfirm={handleDelete}
      />
    </AdminLayoutDetailEdit>
  )
}

export { EditProject }
