import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@status-im/components'
import { AlertIcon, LoadingIcon } from '@status-im/icons/20'
import { validateMnemonic } from 'bip39'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { RecoveryPhraseTextarea } from '../recovery-phrase-textarea'

const mnemonicSchema = z.object({
  mnemonic: z.string().refine(value => validateMnemonic(value), {
    message: 'Invalid phrase. Check word count and spelling.',
  }),
})

type FormValues = z.infer<typeof mnemonicSchema>

type ImportRecoveryPhraseFormProps = {
  onSubmit: (data: FormValues) => void
  loading: boolean
}

const ImportRecoveryPhraseForm = ({
  onSubmit,
  loading = false,
}: ImportRecoveryPhraseFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(mnemonicSchema),
    mode: 'onChange',
    defaultValues: {
      mnemonic: '',
    },
  })

  const {
    formState: { errors },
  } = form

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-1 flex-col justify-between"
      >
        <RecoveryPhraseTextarea
          label="Recovery phrase"
          placeholder="Recovery phrase"
          name="mnemonic"
        />

        <div className="mt-auto flex flex-col gap-6">
          {errors.mnemonic && (
            <p className="flex items-center gap-1 text-danger-50">
              <AlertIcon />
              <span className="text-13">{errors.mnemonic.message}</span>
            </p>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={!form.formState.isValid}
          >
            {loading ? (
              <LoadingIcon className="animate-spin text-white-100" />
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export { ImportRecoveryPhraseForm }
export type { FormValues as ImportRecoveryPhraseFormValues }
