'use client'

import { useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@status-im/components'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { ColorPicker } from '~admin/_components/color-picker'
import { FloatingActions } from '~admin/_components/floating-actions'
import { Form } from '~components/forms/form'
import { Select } from '~components/forms/select'
import { TextArea } from '~components/forms/text-area'
import { TextInput } from '~components/forms/text-input'
import { epicSchema } from '~server/api/validation/epics'

import { InsightsStatusIcon } from '../../_components/insights-status-icon'

import type { SelectProps } from '~components/forms/select'
import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

type Props = {
  defaultValues: FormValues
  onSubmit: SubmitHandler<FormValues>
  variant: 'create' | 'edit'
}

type FormValues = z.infer<typeof epicSchema>

const epicStatusOptions: SelectProps['options'] = [
  {
    label: 'Not started',
    value: 'not-started',
    icon: <InsightsStatusIcon status="not-started" />,
  },
  {
    label: 'In progress',
    value: 'in-progress',
    icon: <InsightsStatusIcon status="in-progress" />,
  },
  {
    label: 'Done',
    value: 'done',
    icon: <InsightsStatusIcon status="done" />,
  },
]

const EpicForm = (props: Props) => {
  const { defaultValues, onSubmit, variant } = props

  const router = useRouter()
  const toast = useToast()

  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(epicSchema),
    mode: 'onTouched',
    defaultValues,
  })

  const handleSubmit: SubmitHandler<FormValues> = async data => {
    try {
      startTransition(async () => {
        await onSubmit(data)
        router.push('/admin/insights/epics')
        toast.positive('Epic updated successfully')
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
          placeholder="Epic name"
          maxLength={30}
        />
        <TextArea
          label="Description"
          name="description"
          placeholder="Set an epic description"
          rows={6}
        />
        <ColorPicker name="color" />
        <Select
          name="status"
          label="Status"
          options={epicStatusOptions}
          required
        />
      </div>
      {form.formState.isDirty && (
        <FloatingActions
          segment="epic"
          variant={variant}
          loading={isPending}
          isDisabled={isPending}
        />
      )}
    </Form>
  )
}

export { EpicForm }
