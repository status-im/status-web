import { useState, useTransition } from 'react'

import { Button, Text } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'
import {
  CreatePasswordForm,
  type CreatePasswordFormValues,
  ImportRecoveryPhraseForm,
  type ImportRecoveryPhraseFormValues,
} from '@status-im/wallet/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useImportWallet } from '../../hooks/use-import-wallet'

import type { SubmitHandler } from 'react-hook-form'

export const Route = createFileRoute('/onboarding/import')({
  component: RouteComponent,
})

type OnboardingState =
  | {
      type: 'import-wallet'
      mnemonic: string
    }
  | {
      type: 'create-password'
      mnemonic: string
    }

function RouteComponent() {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    type: 'import-wallet',
    mnemonic: '',
  })

  return (
    <div className="flex h-full flex-1">
      {onboardingState.type === 'import-wallet' && (
        <ImportWallet
          onNext={(mnemonic: string) => {
            setOnboardingState({ type: 'create-password', mnemonic })
          }}
        />
      )}
      {onboardingState.type === 'create-password' && (
        <CreatePassword
          mnemonic={onboardingState.mnemonic}
          onBack={() =>
            setOnboardingState({
              type: 'import-wallet',
              mnemonic: '',
            })
          }
        />
      )}
    </div>
  )
}

function ImportWallet({ onNext }: { onNext: (mnemonic: string) => void }) {
  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<
    ImportRecoveryPhraseFormValues
  > = async data => {
    try {
      startTransition(async () => {
        onNext(data.mnemonic)
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="pb-4">
        <Button
          href="/onboarding"
          variant="grey"
          icon={<ArrowLeftIcon color="$neutral-100" />}
          aria-label="Back"
          size="32"
        />
      </div>
      <Text size={27} weight="semibold">
        Import via recovery phrase
      </Text>
      <Text size={15} color="$neutral-50" className="mb-4">
        Type or paste your 12, 15, 18, 21 or 24 words Ethereum recovery phrase
      </Text>

      <ImportRecoveryPhraseForm onSubmit={onSubmit} loading={isPending} />
    </div>
  )
}

function CreatePassword({
  mnemonic,
  onBack,
}: {
  mnemonic: string
  onBack: () => void
}) {
  const { importWalletAsync } = useImportWallet()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const handleSubmit: SubmitHandler<CreatePasswordFormValues> = async data => {
    try {
      startTransition(async () => {
        await importWalletAsync({
          mnemonic,
          password: data.password,
        })
        navigate({ to: '/portfolio/assets' })
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button
          onClick={onBack}
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

      <CreatePasswordForm
        onSubmit={handleSubmit}
        loading={isPending}
        confirmButtonLabel="Import Wallet"
      />
    </div>
  )
}
