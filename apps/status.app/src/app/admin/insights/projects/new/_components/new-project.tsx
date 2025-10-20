'use client'

import { useToast } from '@status-im/components'
import { useRouter } from 'next/navigation'

import { createProject } from '../../_actions'
import { ProjectForm } from '../../_components/project-form'

export const NewProject = () => {
  const router = useRouter()
  const toast = useToast()

  return (
    <ProjectForm
      variant="create"
      defaultValues={{
        name: '',
        description: '',
        app: 'shell',
      }}
      onSubmit={async values => {
        try {
          await createProject(values)
          router.push('/admin/insights/projects')
          toast.positive('Project created successfully')
        } catch {
          // handle error
        }
      }}
    />
  )
}
