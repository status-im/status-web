'use client'

import { useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@status-im/components'
import { useForm } from 'react-hook-form'

import { FloatingActions } from '~admin/_components/floating-actions'
import { Form } from '~components/forms/form'
import { Select } from '~components/forms/select'
import { TextArea } from '~components/forms/text-area'
import { TextInput } from '~components/forms/text-input'
import { projectSchema } from '~server/api/validation/projects'

import { InsightsAppIcon } from '../../_components/insights-app-icon'

import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

type Props = {
  defaultValues: FormValues
  onSubmit: SubmitHandler<FormValues>
  variant: 'create' | 'edit'
}

type FormValues = z.infer<typeof projectSchema>

const appType = projectSchema.shape.app

const appTypeOptions = [
  {
    value: appType.Enum.shell,
    label: 'Shell',
    icon: <InsightsAppIcon type={appType.Enum.shell} />,
  },
  {
    value: appType.Enum.communities,
    label: 'Communities',
    icon: <InsightsAppIcon type={appType.Enum.communities} />,
  },
  {
    value: appType.Enum.messenger,
    label: 'Messenger',
    icon: <InsightsAppIcon type={appType.Enum.messenger} />,
  },
  {
    value: appType.Enum.wallet,
    label: 'Wallet',
    icon: <InsightsAppIcon type={appType.Enum.wallet} />,
  },
  {
    value: appType.Enum.browser,
    label: 'Browser',
    icon: <InsightsAppIcon type={appType.Enum.browser} />,
  },
  {
    value: appType.Enum.node,
    label: 'Node',
    icon: <InsightsAppIcon type={appType.Enum.node} />,
  },
]

const ProjectForm = (props: Props) => {
  const { defaultValues, onSubmit, variant } = props

  const [isPending, startTransition] = useTransition()

  const toast = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    mode: 'onTouched',
    defaultValues,
  })

  const handleSubmit: SubmitHandler<FormValues> = async data => {
    try {
      startTransition(async () => {
        await onSubmit(data)
      })
    } catch (error) {
      console.error(error)
      toast.negative('Something went wrong. Please try again later.')
    }
  }

  return (
    <Form {...form} onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <TextInput
          label="Name"
          name="name"
          placeholder="Project name"
          maxLength={30}
        />

        <TextArea
          label="Description"
          name="description"
          placeholder="Set a project description"
          rows={6}
        />
        <Select label="App" name="app" options={appTypeOptions} required />
      </div>
      {form.formState.isDirty && (
        <FloatingActions
          segment="project"
          variant={variant}
          loading={isPending}
          isDisabled={isPending}
        />
      )}
    </Form>
  )
}

export { ProjectForm }
