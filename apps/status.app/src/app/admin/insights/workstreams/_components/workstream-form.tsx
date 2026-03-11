'use client'

import { useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@status-im/components'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import { ColorPicker } from '~admin/_components/color-picker'
import { FloatingActions } from '~admin/_components/floating-actions'
import { EmojiPickerInput } from '~components/emoji-picker-input'
import { Form } from '~components/forms/form'
import { TextArea } from '~components/forms/text-area'
import { TextInput } from '~components/forms/text-input'
import { workstreamSchema } from '~server/api/validation/workstreams'

import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

type Props = {
  defaultValues: FormValues
  onSubmit: SubmitHandler<FormValues>
  variant: 'create' | 'edit'
}

type FormValues = z.infer<typeof workstreamSchema>

const WorkstreamForm = (props: Props) => {
  const { defaultValues, onSubmit, variant } = props

  const [isPending, startTransition] = useTransition()

  const toast = useToast()
  const t = useTranslations('admin')

  const form = useForm<FormValues>({
    resolver: zodResolver(workstreamSchema),
    mode: 'onTouched',
    defaultValues,
  })

  const router = useRouter()

  const handleSubmit: SubmitHandler<FormValues> = async data => {
    try {
      startTransition(async () => {
        await onSubmit(data)
        router.push('/admin/insights/workstreams')
        toast.positive(t('workstreamAdded'))
      })
    } catch (error) {
      console.error(error)
      toast.negative(t('genericError'))
    }
  }

  return (
    <Form {...form} onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <EmojiPickerInput name="emoji" />
        <TextInput
          label={t('name')}
          name="name"
          placeholder={t('workstreamName')}
          maxLength={30}
        />
        <TextArea
          label={t('description')}
          name="description"
          placeholder={t('workstreamDescriptionPlaceholder')}
          rows={6}
        />
        <ColorPicker name="color" />
      </div>

      {form.formState.isDirty && (
        <FloatingActions
          segment="workstream"
          variant={variant}
          loading={isPending}
          isDisabled={isPending}
        />
      )}
    </Form>
  )
}

export { WorkstreamForm }
