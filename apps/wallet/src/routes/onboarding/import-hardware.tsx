import { useRef, useState } from 'react'

import { parseConnection } from '@qrkit/core'
import { useQRScanner } from '@qrkit/react'
import { Button, Input, Text } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useImportHardwareWallet } from '../../hooks/use-import-hardware-wallet'

import type { Account, ScannedUR } from '@qrkit/core'

export const Route = createFileRoute('/onboarding/import-hardware')({
  component: RouteComponent,
})

/**
 * Hardware-wallet onboarding flow.
 *
 * Reads an animated BC-UR QR via @qrkit/react's useQRScanner, assembles the
 * fragments internally, parses the resulting CBOR via @qrkit/core's
 * `parseConnection`, and stores the resulting account(s) as a watch-only
 * wallet. Compatible with any ERC-4527 air-gapped device (Keystone, AirGap
 * Vault, NGRAVE, GapSign, etc.). The signing flow is not implemented yet —
 * `getSigningKey` throws `WALLET_IS_WATCH_ONLY` for these wallets.
 */
function RouteComponent() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<Account | null>(null)

  if (selected) {
    return (
      <Confirm
        account={selected}
        onBack={() => {
          setSelected(null)
          if (accounts.length > 1) return // go back to account select
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

  return <ScannerScreen onAccounts={setAccounts} />
}

function ScannerScreen({
  onAccounts,
}: {
  onAccounts: (accounts: Account[]) => void
}) {
  const onAccountsRef = useRef(onAccounts)
  onAccountsRef.current = onAccounts

  const [error, setError] = useState<string | null>(null)

  const { videoRef, progress } = useQRScanner({
    onScan: (result: ScannedUR | string): boolean => {
      if (typeof result === 'string') return false
      try {
        const found = parseConnection(result, { chains: ['evm'] })
        if (found.length === 0) {
          setError('No EVM account found in scanned QR.')
          return false
        }
        onAccountsRef.current(found)
        return true
      } catch (e) {
        setError(`Parse error: ${(e as Error).message}`)
        return false
      }
    },
  })

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
        Connect a hardware wallet
      </Text>
      <Text size={15} color="$neutral-50" className="mb-4">
        Use any air-gapped wallet that supports the ERC-4527 QR standard:
        Keystone, AirGap Vault, NGRAVE, GapSign, and others. On your device,
        choose Connect Software Wallet and pick the generic QR / MetaMask
        option, then point the screen at this camera.
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
      {error && <p className="mt-2 text-13 text-danger-50">{error}</p>}
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
        {accounts.map(account => (
          <button
            key={account.address}
            onClick={() => onSelect(account)}
            className="flex flex-col gap-1 rounded-12 border border-neutral-10 bg-neutral-2.5 p-3 text-left hover:bg-neutral-5"
          >
            <Text size={13} color="$neutral-50">
              {account.chain === 'evm' ? 'Ethereum' : account.chain}
            </Text>
            <Text size={13} weight="medium" className="break-all">
              {account.address}
            </Text>
          </button>
        ))}
      </div>
    </div>
  )
}

function Confirm({
  account,
  onBack,
}: {
  account: Account
  onBack: () => void
}) {
  const { importHardwareWalletAsync, isPending } = useImportHardwareWallet()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [name, setName] = useState('Hardware Wallet')

  const handleImport = async () => {
    try {
      await importHardwareWalletAsync({
        name,
        vendor:
          account.chain === 'evm'
            ? account.device ?? 'air-gapped'
            : 'air-gapped',
        address: account.address,
        publicKey: account.publicKey,
        sourceFingerprint:
          account.chain === 'evm' ? account.sourceFingerprint : undefined,
      })
      await queryClient.invalidateQueries({ queryKey: ['session', 'status'] })
      navigate({ to: '/portfolio/assets' })
    } catch (error) {
      console.error('hardware-wallet import failed', error)
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

      <Button onClick={handleImport} disabled={isPending || !name.trim()}>
        {isPending ? 'Importing…' : 'Import wallet'}
      </Button>
    </div>
  )
}
