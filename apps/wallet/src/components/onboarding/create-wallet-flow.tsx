import { useState } from 'react'

import { Button, Text } from '@status-im/components'
import { LoadingIcon } from '@status-im/icons/20'
import { type CreatePasswordFormValues } from '@status-im/wallet/components'

import { useCreateWallet } from '@/hooks/use-create-wallet'
import { useWalletFlowSuccess } from '@/hooks/use-wallet-flow-success'
import { usePassword } from '@/providers/password-context'

import { BackButton } from './back-button'
import { CreatePasswordStep } from './create-password-step'

import type { SubmitHandler } from 'react-hook-form'

type Props = {
  backHref: string
  successHref: string
  requiresPasswordCreation?: boolean
}

export function CreateWalletFlow({
  backHref,
  successHref,
  requiresPasswordCreation = true,
}: Props) {
  const { createWalletAsync } = useCreateWallet()
  const { requestPassword } = usePassword()
  const onSuccess = useWalletFlowSuccess(successHref)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async (password?: string) => {
    const wallet = await createWalletAsync(password)
    await onSuccess(wallet, `Created ${wallet.name}`)
  }

  const handlePasswordSubmit: SubmitHandler<
    CreatePasswordFormValues
  > = async data => {
    setIsLoading(true)
    try {
      await handleCreate(data.password)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmWithModal = async () => {
    setIsLoading(true)
    try {
      const isUnlocked = await requestPassword({
        title: 'Enter password',
        description: 'To create a new wallet',
        requireFreshPassword: true,
      })
      if (!isUnlocked) return
      await handleCreate()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (requiresPasswordCreation) {
    return (
      <div className="flex h-full flex-1">
        <CreatePasswordStep
          backHref={backHref}
          onSubmit={handlePasswordSubmit}
          isLoading={isLoading}
          backButtonClassName="pb-4"
          confirmButtonLabel="Create wallet"
        />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-1">
      <div className="flex items-center pb-4">
        <BackButton href={backHref} />
      </div>
      <Text size={27} weight="semibold">
        Create wallet
      </Text>
      <Text size={15} color="$neutral-50" className="mb-auto">
        To create a new wallet, confirm your password in the modal.
      </Text>

      <Button
        variant="primary"
        onClick={handleConfirmWithModal}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingIcon className="animate-spin text-white-100" />
        ) : (
          'Create wallet'
        )}
      </Button>
    </div>
  )
}
