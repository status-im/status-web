'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@status-im/components'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import { FloatingActions } from '~admin/_components/floating-actions'
import { Form } from '~components/forms/form'
import { TextInput } from '~components/forms/text-input'

import { addDevice } from '../_actions'
import { FormDataSchema } from '../schema'

import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

type Inputs = z.infer<typeof FormDataSchema>

const NewDeviceForm = () => {
  const toast = useToast()
  const t = useTranslations('admin')
  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    mode: 'onTouched',
    defaultValues: {
      publicKey: '',
      uid: '',
    },
  })
  const router = useRouter()

  const formHasValues =
    form.formState.dirtyFields.publicKey || form.formState.dirtyFields.uid

  const handleSubmit: SubmitHandler<Inputs> = async data => {
    const result = await addDevice(data)

    if (!result) {
      toast.negative(t('genericError'))
      return
    }

    // TODO: handle error
    if (result.error) {
      // set local error state
      console.log(result.error)
      return
    }

    form.reset()
    toast.positive(t('deviceAdded'))
    router.push('/admin/keycard/devices')
  }

  return (
    <>
      <Form
        {...form}
        onSubmit={handleSubmit}
        className="relative h-full overflow-hidden"
      >
        <div className="flex max-w-[462px] flex-col gap-4">
          <TextInput
            label={t('uid')}
            name="uid"
            placeholder={t('uidPlaceholder')}
          />
          <TextInput
            label={t('publicKey')}
            name="publicKey"
            placeholder="0x183912Ddd631317315C7bEa3bFE8919Da5f301F5"
          />
        </div>
        {formHasValues && (
          <FloatingActions
            segment="device"
            variant="create"
            loading={form.formState.isSubmitting}
            isDisabled={form.formState.isSubmitting}
          />
        )}
      </Form>
    </>
  )
}

export { NewDeviceForm }
