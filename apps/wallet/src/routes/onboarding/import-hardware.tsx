import { useCallback, useEffect, useRef, useState } from 'react'

import { UrFountainDecoder } from '@qrkit/bc-ur'
import { parseConnection } from '@qrkit/core'
import { Button, Input, Text } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import jsQR from 'jsqr'

import { useImportHardwareWallet } from '../../hooks/use-import-hardware-wallet'

import type { Account, ScannedUR } from '@qrkit/core'

export const Route = createFileRoute('/onboarding/import-hardware')({
  component: RouteComponent,
})

/**
 * Hardware-wallet onboarding flow.
 *
 * Reads an animated BC-UR QR via jsQR, assembles the fragments through
 * @qrkit/bc-ur's UrFountainDecoder, parses the resulting CBOR via
 * @qrkit/core's `parseConnection`, and stores the resulting account as a
 * watch-only wallet. Compatible with any ERC-4527 air-gapped device
 * (Keystone, AirGap Vault, NGRAVE, GapSign, etc.). The signing flow is not
 * implemented yet — `getSigningKey` throws `WALLET_IS_WATCH_ONLY` for these
 * wallets.
 */
function RouteComponent() {
  const [account, setAccount] = useState<Account | null>(null)

  if (account) {
    return <Confirm account={account} onBack={() => setAccount(null)} />
  }

  return <ScannerScreen onAccount={setAccount} />
}

function ScannerScreen({ onAccount }: { onAccount: (acc: Account) => void }) {
  const { videoRef, progress, error } = useUrScanner(onAccount)

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

interface UseUrScannerResult {
  videoRef: React.RefObject<HTMLVideoElement | null>
  progress: number | null
  error: string | null
}

/**
 * Owns the camera stream, the per-frame jsQR loop, and the UR fountain
 * decoder. Mounts/unmounts cleanly with the host component — there is no
 * external reset API; if the caller wants a fresh scanner it should remount
 * the component.
 */
function useUrScanner(
  onAccount: (account: Account) => void,
): UseUrScannerResult {
  const videoRef = useRef<HTMLVideoElement>(null)
  const onAccountRef = useRef(onAccount)
  onAccountRef.current = onAccount

  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleQrString = useCallback(
    (decoder: UrFountainDecoder, data: string): boolean => {
      if (!data.toLowerCase().startsWith('ur:')) return false
      try {
        decoder.receivePartUr(data.toLowerCase())
      } catch {
        return false
      }
      setProgress(Math.round(decoder.estimatedPercentComplete() * 100))
      if (!decoder.isComplete()) return false
      try {
        const ur = decoder.resultUr
        const scanned: ScannedUR = { type: ur.type, cbor: ur.getPayloadCbor() }
        const accounts = parseConnection(scanned, { chains: ['evm'] })
        const acc = accounts[0]
        if (!acc) {
          setError('No EVM account found in scanned QR.')
          return false
        }
        onAccountRef.current(acc)
        return true
      } catch (e) {
        setError(`Parse error: ${(e as Error).message}`)
        return false
      }
    },
    [],
  )

  useEffect(() => {
    let stream: MediaStream | null = null
    let raf: number | null = null
    let done = false
    const decoder = new UrFountainDecoder()
    const canvas = document.createElement('canvas')

    const processFrame = (): void => {
      const video = videoRef.current
      if (!video || done) return

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) {
          setError('Could not get 2D canvas context')
          return
        }
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        let imageData: ImageData
        try {
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        } catch {
          setError(
            'Canvas access blocked. Disable fingerprinting protection for this site to scan QR codes.',
          )
          return
        }
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code && handleQrString(decoder, code.data)) {
          done = true
          return
        }
      }

      raf = requestAnimationFrame(processFrame)
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        stream = s
        if (!videoRef.current) return
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(() => {})
        raf = requestAnimationFrame(processFrame)
      })
      .catch((e: Error) => {
        setError(`Camera error: ${e.name}: ${e.message}`)
      })

    return () => {
      done = true
      if (raf !== null) cancelAnimationFrame(raf)
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [handleQrString])

  return { videoRef, progress, error }
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
        // note: parseConnection does not currently expose the device vendor
        // string. A generic label keeps the import working with any ERC-4527
        // wallet; vendor detection can be added when @qrkit/core surfaces it.
        vendor: 'air-gapped',
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
      <div className="gap-1 rounded-12 border border-neutral-10 bg-neutral-2.5 p-3">
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
