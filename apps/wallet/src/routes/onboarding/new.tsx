import { useState } from 'react'

import { Button } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'
import { CreatePasswordForm } from '@status-im/wallet/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useWallet } from '@/providers/wallet-context'

import { useCreateWallet } from '../../hooks/use-create-wallet'

import type { CreatePasswordFormValues } from '@status-im/wallet/components'
import type { SubmitHandler } from 'react-hook-form'

export const Route = createFileRoute('/onboarding/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const { createWalletAsync } = useCreateWallet()
  const { setMnemonic } = useWallet()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit: SubmitHandler<CreatePasswordFormValues> = async data => {
    setIsLoading(true)
    try {
      const mnemonic = await createWalletAsync(data.password)

      setMnemonic(mnemonic)
      navigate({ to: '/portfolio/assets' })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
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

        <CreatePasswordForm onSubmit={handleSubmit} loading={isLoading} />
      </div>
    </div>
  )
}
