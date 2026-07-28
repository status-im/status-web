import { useState, useTransition } from 'react'

import { Text } from '@status-im/components'
import {
  type CreatePasswordFormValues,
  ImportRecoveryPhraseForm,
  type ImportRecoveryPhraseFormValues,
} from '@status-im/wallet/components'

import { Link } from '@/components/link'
import { useDiscoverAccounts } from '@/hooks/use-discover-accounts'
import { useImportWallet } from '@/hooks/use-import-wallet'
import { useWalletFlowSuccess } from '@/hooks/use-wallet-flow-success'
import { usePassword } from '@/providers/password-context'

import { BackButton } from './back-button'
import { CreatePasswordStep } from './create-password-step'
import { SelectAccountsStep } from './select-accounts-step'

import type { AccountPreview } from './select-accounts-step'
import type { SubmitHandler } from 'react-hook-form'

type Props = {
  backHref: string
  successHref: string
  requiresPasswordCreation?: boolean
  hardwareWalletHref?: string
}

type ImportFlowStep =
  | { step: 'enter-mnemonic'; mnemonic: string }
  | { step: 'select-accounts'; mnemonic: string }
  | { step: 'create-password'; mnemonic: string; derivationPaths: string[] }

export function ImportWalletFlow({
  backHref,
  successHref,
  requiresPasswordCreation = true,
  hardwareWalletHref,
}: Props) {
  const { importWalletAsync } = useImportWallet()
  // Discovery lives in the flow and is triggered from the mnemonic submit
  // handler. Do not move it into a mount effect of the select-accounts step:
  // calling mutate() during the initial effect detaches the mutation observer
  // under StrictMode's remount and the result never reaches the UI.
  const {
    discoverAccounts,
    data: discoveredAccounts,
    isPending: isDiscovering,
    isError: discoveryFailed,
  } = useDiscoverAccounts()
  const { requestPassword } = usePassword()
  const onSuccess = useWalletFlowSuccess(successHref)
  const [isLoading, setIsLoading] = useState(false)
  const [flowStep, setFlowStep] = useState<ImportFlowStep>({
    step: 'enter-mnemonic',
    mnemonic: '',
  })
  // Lifted so custom paths survive navigating back from the password step
  const [customAccounts, setCustomAccounts] = useState<AccountPreview[]>([])

  const completeImport = async (
    mnemonic: string,
    derivationPaths: string[],
    password?: string,
  ) => {
    const wallet = await importWalletAsync({
      mnemonic,
      password,
      derivationPaths,
    })
    await onSuccess(wallet, `Imported ${wallet.name}`)
  }

  const handleMnemonicSubmit: SubmitHandler<
    ImportRecoveryPhraseFormValues
  > = async data => {
    setCustomAccounts([])
    discoverAccounts({ mnemonic: data.mnemonic })
    setFlowStep({ step: 'select-accounts', mnemonic: data.mnemonic })
  }

  const handleAccountsSubmit = async (derivationPaths: string[]) => {
    if (flowStep.step !== 'select-accounts') return

    if (requiresPasswordCreation) {
      setFlowStep({
        step: 'create-password',
        mnemonic: flowStep.mnemonic,
        derivationPaths,
      })
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
      await completeImport(flowStep.mnemonic, derivationPaths)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit: SubmitHandler<
    CreatePasswordFormValues
  > = async data => {
    if (flowStep.step !== 'create-password') return

    setIsLoading(true)
    try {
      await completeImport(
        flowStep.mnemonic,
        flowStep.derivationPaths,
        data.password,
      )
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
            step: 'select-accounts',
            mnemonic: flowStep.mnemonic,
          })
        }
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
        confirmButtonLabel="Import Wallet"
      />
    )
  }

  if (flowStep.step === 'select-accounts') {
    return (
      <SelectAccountsStep
        mnemonic={flowStep.mnemonic}
        discoveredAccounts={discoveredAccounts}
        isDiscovering={isDiscovering}
        discoveryFailed={discoveryFailed}
        customAccounts={customAccounts}
        onCustomAccountsChange={setCustomAccounts}
        onBack={() =>
          setFlowStep({
            step: 'enter-mnemonic',
            mnemonic: flowStep.mnemonic,
          })
        }
        onContinue={handleAccountsSubmit}
        isLoading={isLoading}
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
        Type or paste your recovery phrase
      </Text>

      <ImportRecoveryPhraseForm
        onSubmit={handleSubmit}
        loading={isSubmitting}
        defaultValues={{ mnemonic: defaultMnemonic }}
      />

      {hardwareWalletHref && (
        <div className="mt-3 text-center">
          <Link
            href={hardwareWalletHref}
            className="text-13 text-customisation-blue-50 hover:underline"
          >
            Use a hardware wallet instead
          </Link>
        </div>
      )}
    </div>
  )
}
