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
  origin: string
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
        origin,
      }
    case 'typedData':
      return {
        signData: request.typedData,
        dataType: EthDataType.TypedData,
        address,
        sourceFingerprint,
        origin,
      }
    case 'transaction':
      return {
        signData: request.serializedTx,
        dataType: EthDataType.TypedTransaction,
        address,
        sourceFingerprint,
        chainId: request.chainId,
        origin,
      }
  }
}

function HardwareSignScreen({
  request,
  address,
  sourceFingerprint,
  origin,
  onSignature,
  onCancel,
  backButtonProps,
}: Props) {
  const [phase, setPhase] = useState<'display' | 'scan'>('display')
  const [scanError, setScanError] = useState<string | null>(null)

  const parts = useMemo(
    () =>
      buildEthSignRequestURParts(
        toSignRequestParams(request, address, sourceFingerprint, origin),
      ),
    [request, address, sourceFingerprint, origin],
  )

  const handleScan = useCallback(
    (result: ScannedUR | string) => {
      if (typeof result === 'string') return false
      try {
        const signature = parseEthSignature(result)
        setScanError(null)
        onSignature(signature)
        return true
      } catch (error) {
        setScanError(
          error instanceof Error
            ? `Parse error: ${error.message}`
            : 'Failed to parse the scanned signature.',
        )
        return false
      }
    },
    [onSignature],
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
            <QRDisplay parts={parts} interval={200} className="size-full" />
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
