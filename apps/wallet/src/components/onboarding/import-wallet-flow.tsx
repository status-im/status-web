import { useState, useTransition } from 'react'

import { Text } from '@status-im/components'
import {
  type CreatePasswordFormValues,
  ImportRecoveryPhraseForm,
  type ImportRecoveryPhraseFormValues,
} from '@status-im/wallet/components'

import { useImportWallet } from '@/hooks/use-import-wallet'
import { useWalletFlowSuccess } from '@/hooks/use-wallet-flow-success'
import { usePassword } from '@/providers/password-context'

import { BackButton } from './back-button'
import { CreatePasswordStep } from './create-password-step'

import type { SubmitHandler } from 'react-hook-form'

type Props = {
  backHref: string
  successHref: string
  requiresPasswordCreation?: boolean
  hardwareWalletHref?: string
}

type ImportFlowStep =
  | { step: 'enter-mnemonic'; mnemonic: string }
  | { step: 'create-password'; mnemonic: string }

export function ImportWalletFlow({
  backHref,
  successHref,
  requiresPasswordCreation = true,
  hardwareWalletHref,
}: Props) {
  const { importWalletAsync } = useImportWallet()
  const { requestPassword } = usePassword()
  const onSuccess = useWalletFlowSuccess(successHref)
  const [isLoading, setIsLoading] = useState(false)
  const [flowStep, setFlowStep] = useState<ImportFlowStep>({
    step: 'enter-mnemonic',
    mnemonic: '',
  })

  const completeImport = async (mnemonic: string, password?: string) => {
    const wallet = await importWalletAsync({ mnemonic, password })
    await onSuccess(wallet, `Imported ${wallet.name}`)
  }

  const handleMnemonicSubmit: SubmitHandler<
    ImportRecoveryPhraseFormValues
  > = async data => {
    if (requiresPasswordCreation) {
      setFlowStep({ step: 'create-password', mnemonic: data.mnemonic })
      return
    }

    setIsLoading(true)
    try {
      const isUnlocked = await requestPassword({
        title: 'Enter password',
        description: 'To import your wallet',
        requireFreshPassword: true,
      })
      if (!isUnlocked) return
      await completeImport(data.mnemonic)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit: SubmitHandler<
    CreatePasswordFormValues
  > = async data => {
    setIsLoading(true)
    try {
      await completeImport(flowStep.mnemonic, data.password)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (flowStep.step === 'create-password') {
    return (
      <CreatePasswordStep
        onBack={() =>
          setFlowStep({
            step: 'enter-mnemonic',
            mnemonic: flowStep.mnemonic,
          })
        }
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
        confirmButtonLabel="Import Wallet"
      />
    )
  }

  return (
    <ImportMnemonicStep
      backHref={backHref}
      defaultMnemonic={flowStep.mnemonic}
      hardwareWalletHref={hardwareWalletHref}
      isLoading={isLoading}
      onSubmit={handleMnemonicSubmit}
    />
  )
}

function ImportMnemonicStep({
  backHref,
  defaultMnemonic,
  hardwareWalletHref,
  isLoading,
  onSubmit,
}: {
  backHref: string
  defaultMnemonic: string
  hardwareWalletHref?: string
  isLoading: boolean
  onSubmit: SubmitHandler<ImportRecoveryPhraseFormValues>
}) {
  const [isPending, startTransition] = useTransition()
  const isSubmitting = isPending || isLoading

  const handleSubmit: SubmitHandler<ImportRecoveryPhraseFormValues> = data => {
    if (isLoading) return
    startTransition(() => {
      void onSubmit(data)
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center pb-4">
        <BackButton href={backHref} />
      </div>
      <Text size={27} weight="semibold">
        Import via recovery phrase
      </Text>
      <Text size={15} color="$neutral-50" className="mb-4">
        Type or paste your 12, 15, 18, 21 or 24 words Ethereum recovery phrase
      </Text>

      <ImportRecoveryPhraseForm
        onSubmit={handleSubmit}
        loading={isSubmitting}
        defaultValues={{ mnemonic: defaultMnemonic }}
      />

      {hardwareWalletHref && (
        <div className="mt-3 text-center">
          <a
            href={hardwareWalletHref}
            className="text-13 text-customisation-blue-50 hover:underline"
          >
            Use a hardware wallet instead
          </a>
        </div>
      )}
    </div>
  )
}
