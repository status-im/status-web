import { useCallback, useState } from 'react'

import { parseConnection } from '@qrkit/core'
import { useQRScanner } from '@qrkit/react'
import { Button, Input, Text } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { useImportHardwareWallet } from '../../hooks/use-import-hardware-wallet'

import type { Account, ScannedUR } from '@qrkit/core'

const DEFAULT_HARDWARE_WALLET_NAME = 'Hardware Wallet'
const DEFAULT_HARDWARE_WALLET_VENDOR = 'air-gapped'
const DEFAULT_ADDRESS_INDEX = 0

type Props = {
  backHref: string
  successHref: string
}

export function ImportHardwareWalletFlow({ backHref, successHref }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<Account | null>(null)
  const accountToConfirm =
    selected ?? (accounts.length === 1 ? accounts[0] : null)

  if (accountToConfirm) {
    return (
      <Confirm
        account={accountToConfirm}
        successHref={successHref}
        onBack={() => {
          setSelected(null)
          if (accounts.length > 1) return
          setAccounts([])
        }}
      />
    )
  }

  if (accounts.length > 1) {
    return (
      <AccountSelect
        accounts={accounts}
        onSelect={setSelected}
        onBack={() => setAccounts([])}
      />
    )
  }

  return <ScannerScreen backHref={backHref} onAccounts={setAccounts} />
}

function ScannerScreen({
  backHref,
  onAccounts,
}: {
  backHref: string
  onAccounts: (accounts: Account[]) => void
}) {
  const [scanError, setScanError] = useState<string | null>(null)
  const handleScan = useCallback(
    (result: ScannedUR | string) => {
      if (typeof result === 'string') {
        return false
      }

      try {
        const foundAccounts = parseConnection(result, { chains: ['evm'] })
        if (foundAccounts.length === 0) {
          setScanError('No EVM account found in scanned QR.')
          return false
        }

        setScanError(null)
        onAccounts(foundAccounts)
        return true
      } catch (error) {
        setScanError(
          error instanceof Error
            ? `Parse error: ${error.message}`
            : 'Failed to parse the scanned QR code.',
        )
        return false
      }
    },
    [onAccounts],
  )
  const {
    videoRef,
    progress,
    error: scannerError,
  } = useQRScanner({
    onScan: useCallback(
      (result: ScannedUR | string) => {
        return handleScan(result)
      },
      [handleScan],
    ),
  })
  const errorMessage = scannerError ?? scanError

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="pb-4">
        <Button
          href={backHref}
          variant="grey"
          icon={<ArrowLeftIcon color="$neutral-100" />}
          aria-label="Back"
          size="32"
        />
      </div>
      <Text size={27} weight="semibold">
        Connect a hardware wallet
      </Text>
      <Text size={15} color="$neutral-50" className="mb-4">
        Use any air-gapped wallet that supports the ERC-4527 QR standard:
        Keycard, Keystone, AirGap Vault, NGRAVE, GapSign, and others. On your
        device, choose Connect Software Wallet and pick the generic QR /
        MetaMask option, then point the screen at this camera.
      </Text>
      <div className="relative aspect-square w-full overflow-hidden rounded-12 bg-neutral-100">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="block size-full object-cover"
        />
        {progress !== null && progress < 100 && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[12px] text-white-100"
            style={{ background: 'rgba(9, 16, 28, 0.7)' }}
          >
            {progress}%
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="mt-2 text-13 text-danger-50">{errorMessage}</p>
      )}
    </div>
  )
}

function AccountSelect({
  accounts,
  onSelect,
  onBack,
}: {
  accounts: Account[]
  onSelect: (account: Account) => void
  onBack: () => void
}) {
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
        Select account
      </Text>
      <Text size={15} color="$neutral-50">
        Multiple accounts were found in the QR code. Select one to import.
      </Text>
      <div className="flex flex-col gap-2">
        {accounts.map(account => {
          const derived = account.deriveAddress(DEFAULT_ADDRESS_INDEX)
          return (
            <button
              key={derived.address}
              onClick={() => onSelect(account)}
              className="flex flex-col gap-1 rounded-12 border border-neutral-10 bg-neutral-2.5 p-3 text-left hover:bg-neutral-5"
            >
              <Text size={13} color="$neutral-50">
                {account.chain === 'evm' ? 'Ethereum' : account.chain}
              </Text>
              <Text size={13} weight="medium" className="break-all">
                {derived.address}
              </Text>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Confirm({
  account,
  successHref,
  onBack,
}: {
  account: Account
  successHref: string
  onBack: () => void
}) {
  const { importHardwareWalletAsync, isPending } = useImportHardwareWallet()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const derivedAddress = account.deriveAddress(DEFAULT_ADDRESS_INDEX)
  const [name, setName] = useState(
    account.device ?? DEFAULT_HARDWARE_WALLET_NAME,
  )
  const [error, setError] = useState<string | null>(null)
  const trimmedName = name.trim()

  const handleImport = async () => {
    try {
      setError(null)
      await importHardwareWalletAsync({
        name: trimmedName,
        vendor: account.device ?? DEFAULT_HARDWARE_WALLET_VENDOR,
        address: derivedAddress.address,
        derivationPath: derivedAddress.derivationPath,
        publicKey: derivedAddress.publicKey,
        sourceFingerprint:
          account.chain === 'evm' ? account.sourceFingerprint : undefined,
      })
      await queryClient.invalidateQueries({ queryKey: ['session', 'status'] })
      navigate({ to: successHref })
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
          {derivedAddress.address}
        </Text>
      </div>

      <Input
        label="Wallet name"
        value={name}
        onChange={setName}
        placeholder="Hardware Wallet"
      />

      {error && <p className="text-13 text-danger-50">{error}</p>}

      <Button onClick={handleImport} disabled={isPending || trimmedName === ''}>
        {isPending ? 'Importing…' : 'Import wallet'}
      </Button>
    </div>
  )
}
