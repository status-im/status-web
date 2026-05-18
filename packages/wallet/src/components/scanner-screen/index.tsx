'use client'

import { type ComponentProps, useCallback, useState } from 'react'

import { type Account, parseConnection, type ScannedUR } from '@qrkit/core'
import { useQRScanner } from '@qrkit/react'
import { Button, Text } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'

const DEFAULT_ADDRESS_INDEX = 0

export type HardwareWalletAccount = {
  chain: string
  address: string
  derivationPath: string
  publicKey: string
  sourceFingerprint: number | undefined
  device: string | undefined
}

function toHardwareWalletAccount(account: Account): HardwareWalletAccount {
  const derived = account.deriveAddress(DEFAULT_ADDRESS_INDEX)
  return {
    chain: account.chain,
    address: derived.address,
    derivationPath: derived.derivationPath,
    publicKey: derived.publicKey,
    sourceFingerprint:
      account.chain === 'evm' ? account.sourceFingerprint : undefined,
    device: account.device,
  }
}

type BackButtonProps = Omit<ComponentProps<typeof Button>, 'children'>

type Props = {
  backButtonProps?: BackButtonProps
  onAccounts: (accounts: HardwareWalletAccount[]) => void
}

function ScannerScreen({ backButtonProps, onAccounts }: Props) {
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
        onAccounts(foundAccounts.map(toHardwareWalletAccount))
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
      {backButtonProps && (
        <div className="pb-4">
          <Button
            variant="grey"
            icon={<ArrowLeftIcon color="$neutral-100" />}
            aria-label="Back"
            size="32"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(backButtonProps as any)}
          />
        </div>
      )}
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

export { ScannerScreen }
export type { Props as ScannerScreenProps }
