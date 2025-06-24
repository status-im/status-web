import { useTransition } from 'react'

import { Button } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'
import { CreatePasswordForm } from '@status-im/wallet/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useCreateWallet } from '../../hooks/use-create-wallet'

import type { CreatePasswordFormValues } from '@status-im/wallet/components'
import type { SubmitHandler } from 'react-hook-form'

export const Route = createFileRoute('/onboarding/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const { createWalletAsync } = useCreateWallet()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const handleSubmit: SubmitHandler<CreatePasswordFormValues> = async data => {
    try {
      startTransition(async () => {
        await createWalletAsync(data.password)
        navigate({ to: '/portfolio' })
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex h-full flex-1">
      <div className="flex flex-col gap-4">
        <div>
          <Button
            href="/onboarding"
            variant="grey"
            icon={<ArrowLeftIcon color="$neutral-100" />}
            aria-label="Back"
            size="32"
          />
        </div>
        <h1 className="text-27 font-600">Create password</h1>
        <div className="text-15 text-neutral-50">
          To unlock the extension and sign transactions, the password is stored
          only on your device. Status can't recover it.
        </div>

        <CreatePasswordForm onSubmit={handleSubmit} loading={isPending} />
      </div>
    </div>
  )
}
