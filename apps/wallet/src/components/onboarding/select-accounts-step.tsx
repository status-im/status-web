import { useState } from 'react'

import { Button, Input, Text } from '@status-im/components'
import { CloseIcon } from '@status-im/icons/20'

import { usePreviewAccount } from '@/hooks/use-preview-account'

import { BackButton } from './back-button'

export type AccountPreview = {
  address: string
  derivationPath: string
  active: boolean
}

const DERIVATION_PATH_REGEX = /^m(\/\d+'?)+$/
const DEFAULT_ETHEREUM_PATH = "m/44'/60'/0'/0/0"

type Props = {
  mnemonic: string
  discoveredAccounts: AccountPreview[] | undefined
  isDiscovering: boolean
  discoveryFailed: boolean
  customAccounts: AccountPreview[]
  onCustomAccountsChange: (accounts: AccountPreview[]) => void
  onBack: () => void
  onContinue: (derivationPaths: string[]) => void
  isLoading: boolean
}

export function SelectAccountsStep({
  mnemonic,
  discoveredAccounts,
  isDiscovering,
  discoveryFailed,
  customAccounts,
  onCustomAccountsChange,
  onBack,
  onContinue,
  isLoading,
}: Props) {
  const { previewAccountAsync, isPending: isAddingPath } = usePreviewAccount()

  const [customPath, setCustomPath] = useState('')
  const [customPathError, setCustomPathError] = useState<string | null>(null)

  const rows = [
    ...(discoveredAccounts ?? []).map(account => ({
      address: account.address,
      derivationPath: account.derivationPath,
      status: account.active ? 'Active' : 'Default',
      custom: false,
    })),
    ...customAccounts.map(account => ({
      address: account.address,
      derivationPath: account.derivationPath,
      status: account.active ? 'Active' : 'No activity',
      custom: true,
    })),
  ]

  const handleAddPath = async () => {
    const derivationPath = customPath.trim()
    setCustomPathError(null)

    if (!DERIVATION_PATH_REGEX.test(derivationPath)) {
      setCustomPathError("Enter a valid derivation path, e.g. m/44'/60'/0'/0/1")
      return
    }
    if (rows.some(row => row.derivationPath === derivationPath)) {
      setCustomPathError('This derivation path is already in the list')
      return
    }

    try {
      const account = await previewAccountAsync({ mnemonic, derivationPath })
      onCustomAccountsChange([...customAccounts, account])
      setCustomPath('')
    } catch (error) {
      console.error('failed to derive custom path', error)
      setCustomPathError('Unable to derive an address for this path')
    }
  }

  const handleRemovePath = (derivationPath: string) => {
    onCustomAccountsChange(
      customAccounts.filter(
        account => account.derivationPath !== derivationPath,
      ),
    )
  }

  const handleContinue = () => {
    // Fall back to the default derivation path if the scan found nothing
    // (e.g. it failed); the wallet always imports at least account 0.
    const discoveredPaths = (discoveredAccounts ?? []).map(
      account => account.derivationPath,
    )
    const basePaths =
      discoveredPaths.length > 0 ? discoveredPaths : [DEFAULT_ETHEREUM_PATH]
    const customPaths = customAccounts.map(account => account.derivationPath)
    onContinue([...new Set([...basePaths, ...customPaths])])
  }

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center pb-4">
        <BackButton onClick={onBack} />
      </div>
      <Text size={27} weight="semibold">
        Accounts to import
      </Text>
      <Text size={15} color="$neutral-50" className="mb-4">
        We scanned your recovery phrase for addresses with on-chain activity.
        All addresses below will be imported.
      </Text>

      {isDiscovering && (
        <Text size={13} color="$neutral-50" className="mb-4">
          Scanning for active addresses…
        </Text>
      )}

      {discoveryFailed && (
        <p className="mb-4 text-13 text-danger-50">
          We could not scan for active addresses. The default address will be
          imported.
        </p>
      )}

      {rows.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {rows.map(row => (
            <div
              key={row.derivationPath}
              className="flex items-center justify-between gap-2 rounded-12 border border-neutral-10 bg-neutral-2.5 p-3"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <Text size={13} color="$neutral-50">
                  {row.derivationPath} · {row.status}
                </Text>
                <Text size={13} weight="medium" className="break-all">
                  {row.address}
                </Text>
              </div>
              {row.custom && (
                <Button
                  onClick={() => handleRemovePath(row.derivationPath)}
                  variant="grey"
                  icon={<CloseIcon color="$neutral-100" />}
                  aria-label={`Remove ${row.derivationPath}`}
                  size="32"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="Custom derivation path"
              value={customPath}
              onChange={setCustomPath}
              placeholder="m/44'/60'/0'/0/1"
            />
          </div>
          <Button
            onClick={handleAddPath}
            variant="grey"
            disabled={isAddingPath || customPath.trim() === ''}
          >
            {isAddingPath ? 'Adding…' : 'Add'}
          </Button>
        </div>
        {customPathError && (
          <p className="text-13 text-danger-50">{customPathError}</p>
        )}
      </div>

      <Button onClick={handleContinue} disabled={isLoading || isDiscovering}>
        {isLoading ? 'Importing…' : 'Continue'}
      </Button>
    </div>
  )
}
