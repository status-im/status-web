import { useState } from 'react'

import { Button, Input, Text } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'
import {
  AccountSelect,
  type CreatePasswordFormValues,
  type HardwareWalletAccount,
  ScannerScreen,
} from '@status-im/wallet/components'

import { useImportHardwareWallet } from '../../hooks/use-import-hardware-wallet'
import { useWalletFlowSuccess } from '../../hooks/use-wallet-flow-success'
import { usePassword } from '../../providers/password-context'
import { CreatePasswordStep } from './create-password-step'

import type { SubmitHandler } from 'react-hook-form'

const DEFAULT_HARDWARE_WALLET_NAME = 'Hardware Wallet'
const DEFAULT_HARDWARE_WALLET_VENDOR = 'air-gapped'

type Props = {
  backHref: string
  successHref: string
  requiresPasswordCreation?: boolean
}

type Phase =
  | { step: 'scan' }
  | { step: 'select'; accounts: HardwareWalletAccount[] }
  | { step: 'confirm'; account: HardwareWalletAccount }
  | { step: 'password'; account: HardwareWalletAccount; name: string }

export function ImportHardwareWalletFlow({
  backHref,
  successHref,
  requiresPasswordCreation = true,
}: Props) {
  const { importHardwareWalletAsync } = useImportHardwareWallet()
  const { requestPassword } = usePassword()
  const onSuccess = useWalletFlowSuccess(successHref)
  const [phase, setPhase] = useState<Phase>({ step: 'scan' })
  const [isLoading, setIsLoading] = useState(false)

  const completeImport = async (
    account: HardwareWalletAccount,
    name: string,
    password?: string,
  ) => {
    const wallet = await importHardwareWalletAsync({
      name,
      password,
      vendor: account.device ?? DEFAULT_HARDWARE_WALLET_VENDOR,
      address: account.address,
      derivationPath: account.derivationPath,
      publicKey: account.publicKey,
      sourceFingerprint: account.sourceFingerprint,
    })
    await onSuccess(wallet, `Imported ${wallet.name}`)
  }

  const handleAccounts = (accounts: HardwareWalletAccount[]) => {
    if (accounts.length === 1) {
      setPhase({ step: 'confirm', account: accounts[0] })
    } else {
      setPhase({ step: 'select', accounts })
    }
  }

  const handleConfirm = async (
    account: HardwareWalletAccount,
    name: string,
  ) => {
    if (requiresPasswordCreation) {
      setPhase({ step: 'password', account, name })
      return
    }

    setIsLoading(true)
    try {
      const isUnlocked = await requestPassword({
        title: 'Enter password',
        description: 'To import your hardware wallet',
        requireFreshPassword: true,
      })
      if (!isUnlocked) return
      await completeImport(account, name)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit: SubmitHandler<
    CreatePasswordFormValues
  > = async data => {
    if (phase.step !== 'password') return

    setIsLoading(true)
    try {
      await completeImport(phase.account, phase.name, data.password)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (phase.step === 'password') {
    return (
      <CreatePasswordStep
        onBack={() => setPhase({ step: 'confirm', account: phase.account })}
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
        confirmButtonLabel="Import wallet"
      />
    )
  }

  if (phase.step === 'confirm') {
    return (
      <Confirm
        account={phase.account}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onBack={() => setPhase({ step: 'scan' })}
      />
    )
  }

  if (phase.step === 'select') {
    const byAddress = new Map(phase.accounts.map(a => [a.address, a]))
    return (
      <AccountSelect
        accounts={phase.accounts}
        onSelect={({ address }) => {
          const account = byAddress.get(address)
          if (account) setPhase({ step: 'confirm', account })
        }}
        onBack={() => setPhase({ step: 'scan' })}
      />
    )
  }

  return (
    <ScannerScreen
      onAccounts={handleAccounts}
      backButtonProps={{ href: backHref }}
    />
  )
}

function Confirm({
  account,
  isLoading,
  onConfirm,
  onBack,
}: {
  account: HardwareWalletAccount
  isLoading: boolean
  onConfirm: (account: HardwareWalletAccount, name: string) => Promise<void>
  onBack: () => void
}) {
  const [name, setName] = useState(
    account.device ?? DEFAULT_HARDWARE_WALLET_NAME,
  )
  const [error, setError] = useState<string | null>(null)
  const trimmedName = name.trim()

  const handleImport = async () => {
    try {
      setError(null)
      await onConfirm(account, trimmedName)
    } catch (error) {
      console.error('hardware-wallet import failed', error)
      setError('Unable to import the hardware wallet. Please try again.')
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <Button
          onClick={onBack}
          variant="grey"
          icon={<ArrowLeftIcon color="$neutral-100" />}
          aria-label="Back"
          size="32"
        />
      </div>
      <Text size={27} weight="semibold">
        Confirm import
      </Text>
      <div className="flex flex-col gap-1 rounded-12 border border-neutral-10 bg-neutral-2.5 p-3">
        {account.device && (
          <>
            <Text size={13} color="$neutral-50">
              Device
            </Text>
            <Text size={13} weight="medium">
              {account.device}
            </Text>
          </>
        )}
        <Text size={13} color="$neutral-50">
          Address
        </Text>
        <Text size={13} weight="medium" className="break-all">
          {account.address}
        </Text>
      </div>

      <Input
        label="Wallet name"
        value={name}
        onChange={setName}
        placeholder="Hardware Wallet"
      />

      {error && <p className="text-13 text-danger-50">{error}</p>}

      <Button onClick={handleImport} disabled={isLoading || trimmedName === ''}>
        {isLoading ? 'Importing…' : 'Import wallet'}
      </Button>
    </div>
  )
}
