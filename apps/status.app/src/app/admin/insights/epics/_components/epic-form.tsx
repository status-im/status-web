'use client'

import { useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@status-im/components'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import { ColorPicker } from '~admin/_components/color-picker'
import { FloatingActions } from '~admin/_components/floating-actions'
import { Form } from '~components/forms/form'
import { Select } from '~components/forms/select'
import { TextArea } from '~components/forms/text-area'
import { TextInput } from '~components/forms/text-input'
import { epicSchema } from '~server/api/validation/epics'

import { getEpicStatusSelectOptions } from '../../_utils/i18n'

import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

type Props = {
  defaultValues: FormValues
  onSubmit: SubmitHandler<FormValues>
  variant: 'create' | 'edit'
}

type FormValues = z.infer<typeof epicSchema>

const EpicForm = (props: Props) => {
  const { defaultValues, onSubmit, variant } = props

  const router = useRouter()
  const toast = useToast()
  const t = useTranslations('admin')
  const epicStatusOptions = getEpicStatusSelectOptions(t)

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
        toast.positive(t('epicUpdated'))
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
          placeholder={t('epicName')}
          maxLength={30}
        />
        <TextArea
          label={t('description')}
          name="description"
          placeholder={t('epicDescriptionPlaceholder')}
          rows={6}
        />
        <ColorPicker name="color" />
        <Select
          name="status"
          label={t('status')}
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
