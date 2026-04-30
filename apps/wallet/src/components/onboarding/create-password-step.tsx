import {
  CreatePasswordForm,
  type CreatePasswordFormValues,
} from '@status-im/wallet/components'

import { BackButton } from './back-button'

import type { SubmitHandler } from 'react-hook-form'

type BaseProps = {
  onSubmit: SubmitHandler<CreatePasswordFormValues>
  isLoading: boolean
  confirmButtonLabel?: string
  backButtonClassName?: string
}

type Props =
  | (BaseProps & { onBack: () => void; backHref?: never })
  | (BaseProps & { backHref: string; onBack?: never })

export function CreatePasswordStep({
  onBack,
  backHref,
  onSubmit,
  isLoading,
  confirmButtonLabel,
  backButtonClassName,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className={`flex items-center ${backButtonClassName ?? ''}`.trim()}>
        {onBack ? (
          <BackButton onClick={onBack} />
        ) : (
          <BackButton href={backHref} />
        )}
      </div>

      <h1 className="text-27 font-600">Create password</h1>
      <div className="text-15 text-neutral-50">
        To unlock the extension and sign transactions, the password is stored
        only on your device. Status can&apos;t recover it.
      </div>

      <CreatePasswordForm
        onSubmit={onSubmit}
        loading={isLoading}
        confirmButtonLabel={confirmButtonLabel}
      />
    </div>
  )
}
