'use client'

import { type ComponentProps, useCallback, useMemo, useState } from 'react'

import {
  buildEthSignRequestURParts,
  EthDataType,
  parseEthSignature,
  type ScannedUR,
} from '@qrkit/core'
import { QRDisplay, useQRScanner } from '@qrkit/react'
import { Button, Text } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'

export class HardwareSignCancelledError extends Error {
  constructor() {
    super('Hardware wallet signing cancelled by user')
    this.name = 'HardwareSignCancelledError'
  }
}

// Drawn larger than shown so the QR stays sharp when scaled to fit.
const QR_BITMAP_SIZE = 800

type BackButtonProps = Omit<ComponentProps<typeof Button>, 'children'>

type Hex = `0x${string}`

export type HardwareSignRequest =
  | {
      kind: 'personalMessage'
      message: Hex | Uint8Array
    }
  | {
      kind: 'typedData'
      typedData: string
    }
  | {
      kind: 'transaction'
      serializedTx: Uint8Array
      chainId: number
    }

type Props = {
  request: HardwareSignRequest
  address: string
  sourceFingerprint: number | undefined
  derivationPath: string | undefined
  origin: string
  /** Why `signature` is not the account's signature over `request`, or null. */
  checkSignature: (signature: string) => string | null
  onSignature: (signature: string) => void
  onCancel: () => void
  backButtonProps?: BackButtonProps
}

function hexToBytes(hex: Hex): Uint8Array {
  const clean = hex.slice(2)
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function toSignRequestParams(
  request: HardwareSignRequest,
  address: string,
  sourceFingerprint: number | undefined,
  derivationPath: string | undefined,
  origin: string,
) {
  switch (request.kind) {
    case 'personalMessage':
      return {
        signData:
          typeof request.message === 'string'
            ? hexToBytes(request.message)
            : request.message,
        dataType: EthDataType.PersonalMessage,
        address,
        sourceFingerprint,
        derivationPath,
        origin,
      }
    case 'typedData':
      return {
        signData: request.typedData,
        dataType: EthDataType.TypedData,
        address,
        sourceFingerprint,
        derivationPath,
        origin,
      }
    case 'transaction':
      return {
        signData: request.serializedTx,
        dataType: EthDataType.TypedTransaction,
        address,
        sourceFingerprint,
        derivationPath,
        chainId: request.chainId,
        origin,
      }
  }
}

function HardwareSignScreen({
  request,
  address,
  sourceFingerprint,
  derivationPath,
  origin,
  checkSignature,
  onSignature,
  onCancel,
  backButtonProps,
}: Props) {
  const [phase, setPhase] = useState<'display' | 'scan'>('display')
  const [scanError, setScanError] = useState<string | null>(null)

  const parts = useMemo(
    () =>
      buildEthSignRequestURParts(
        toSignRequestParams(
          request,
          address,
          sourceFingerprint,
          derivationPath,
          origin,
        ),
      ),
    [request, address, sourceFingerprint, derivationPath, origin],
  )

  const handleScan = useCallback(
    (result: ScannedUR | string) => {
      if (typeof result === 'string') return false
      let signature: string
      try {
        signature = parseEthSignature(result)
      } catch (error) {
        setScanError(
          error instanceof Error
            ? `Parse error: ${error.message}`
            : 'Failed to parse the scanned signature.',
        )
        return false
      }
      const problem = checkSignature(signature)
      if (problem) {
        setScanError(problem)
        return false
      }
      setScanError(null)
      onSignature(signature)
      return true
    },
    [checkSignature, onSignature],
  )

  const {
    videoRef,
    progress,
    error: scannerError,
  } = useQRScanner({
    onScan: handleScan,
    enabled: phase === 'scan',
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
      {phase === 'display' ? (
        <>
          <Text size={27} weight="semibold">
            Sign with hardware wallet
          </Text>
          <Text size={15} color="$neutral-50" className="mb-4">
            Scan this QR code with your air-gapped hardware wallet. Then tap
            Continue to scan the signed response.
          </Text>
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-12 bg-white-100">
            {/* qrcode sizes the canvas with inline styles, so !important is needed to fit it; the hint names one device. */}
            <QRDisplay
              parts={parts}
              interval={200}
              size={QR_BITMAP_SIZE}
              className="size-full [&_canvas]:!size-full [&_p]:hidden"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="grey" onPress={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onPress={() => setPhase('scan')}>
              Continue
            </Button>
          </div>
        </>
      ) : (
        <>
          <Text size={27} weight="semibold">
            Scan signed response
          </Text>
          <Text size={15} color="$neutral-50" className="mb-4">
            Point the camera at the QR code shown by your hardware wallet.
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
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="grey" onPress={onCancel}>
              Cancel
            </Button>
            <Button variant="outline" onPress={() => setPhase('display')}>
              Back to QR
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export { HardwareSignScreen }
export type { Props as HardwareSignScreenProps }
