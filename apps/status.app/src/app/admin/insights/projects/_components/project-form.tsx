'use client'

import { useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@status-im/components'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import { FloatingActions } from '~admin/_components/floating-actions'
import { Form } from '~components/forms/form'
import { Select } from '~components/forms/select'
import { TextArea } from '~components/forms/text-area'
import { TextInput } from '~components/forms/text-input'
import { projectSchema } from '~server/api/validation/projects'

import { getProjectAppSelectOptions } from '../../_utils/i18n'

import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

type Props = {
  defaultValues: FormValues
  onSubmit: SubmitHandler<FormValues>
  variant: 'create' | 'edit'
}

type FormValues = z.infer<typeof projectSchema>

const ProjectForm = (props: Props) => {
  const { defaultValues, onSubmit, variant } = props

  const [isPending, startTransition] = useTransition()

  const toast = useToast()
  const t = useTranslations('admin')
  const appTypeOptions = getProjectAppSelectOptions(t)

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
      toast.negative(t('genericError'))
    }
  }

  return (
    <Form {...form} onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <TextInput
          label={t('name')}
          name="name"
          placeholder={t('projectName')}
          maxLength={30}
        />

        <TextArea
          label={t('description')}
          name="description"
          placeholder={t('projectDescriptionPlaceholder')}
          rows={6}
        />
        <Select label={t('app')} name="app" options={appTypeOptions} required />
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
