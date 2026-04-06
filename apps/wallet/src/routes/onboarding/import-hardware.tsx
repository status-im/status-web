import { useCallback, useEffect, useRef, useState } from 'react'

import { UrFountainDecoder } from '@qrkit/bc-ur'
import { parseConnection } from '@qrkit/core'
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
 * Custom inline scanner (no qrkit modal) so we can see exactly what is
 * happening at every frame. The qrkit hooks have zero logging which made the
 * previous "안됨" reports impossible to diagnose. This component logs:
 *   - getUserMedia state
 *   - video readyState transitions
 *   - every jsQR call result
 *   - every UR fragment received and progress %
 *   - parseConnection result
 *
 * Open the page DevTools console while scanning. The logs will tell us
 * exactly which step is failing.
 */
function RouteComponent() {
  const scanner = useScanner()
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (scanner.account) setShowConfirm(true)
  }, [scanner.account])

  if (scanner.account && showConfirm) {
    return (
      <Confirm
        account={scanner.account}
        onBack={() => {
          setShowConfirm(false)
          scanner.reset()
        }}
      />
    )
  }

  return <ScannerScreen scanner={scanner} />
}

interface UseScannerResult {
  account: Account | null
  reset: () => void
  videoRef: React.RefObject<HTMLVideoElement | null>
  progress: number | null
  error: string | null
  frameCount: number
  qrHits: number
}

function useScanner(): UseScannerResult {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const decoderRef = useRef<UrFountainDecoder>(new UrFountainDecoder())
  const rafRef = useRef<number | null>(null)
  const doneRef = useRef(false)
  const frameCountRef = useRef(0)
  const qrHitsRef = useRef(0)

  const [account, setAccount] = useState<Account | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [frameCount, setFrameCount] = useState(0)
  const [qrHits, setQrHits] = useState(0)

  const reset = useCallback(() => {
    console.log('[scanner] reset')
    decoderRef.current = new UrFountainDecoder()
    setAccount(null)
    setProgress(null)
    setError(null)
    setFrameCount(0)
    setQrHits(0)
    frameCountRef.current = 0
    qrHitsRef.current = 0
    doneRef.current = false
  }, [])

  const handleQrString = useCallback((data: string) => {
    console.log('[scanner] jsQR decoded string:', data.slice(0, 80))
    if (!data.toLowerCase().startsWith('ur:')) {
      console.warn('[scanner] not a UR string, ignoring')
      return
    }
    try {
      decoderRef.current.receivePartUr(data.toLowerCase())
    } catch (e) {
      console.error('[scanner] receivePartUr threw', e)
      return
    }
    const pct = Math.round(decoderRef.current.estimatedPercentComplete() * 100)
    console.log('[scanner] UR progress', pct, '%')
    setProgress(pct)
    if (!decoderRef.current.isComplete()) return
    try {
      const ur = decoderRef.current.resultUr
      const scanned: ScannedUR = { type: ur.type, cbor: ur.getPayloadCbor() }
      console.log('[scanner] UR complete, type=', ur.type)
      const accounts = parseConnection(scanned, { chains: ['evm'] })
      console.log('[scanner] parseConnection accounts=', accounts)
      const acc = accounts[0]
      if (!acc) {
        setError('No EVM account found in scanned QR.')
        return
      }
      doneRef.current = true
      setAccount(acc)
    } catch (e) {
      console.error('[scanner] parseConnection threw', e)
      setError(`Parse error: ${(e as Error).message}`)
    }
  }, [])

  const processFrame = useCallback((): void => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || doneRef.current) return

    frameCountRef.current += 1
    if (frameCountRef.current % 30 === 0) {
      setFrameCount(frameCountRef.current)
      console.log(
        '[scanner] frame',
        frameCountRef.current,
        'readyState=',
        video.readyState,
        'dims=',
        video.videoWidth,
        'x',
        video.videoHeight,
      )
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      setError('Could not get 2D canvas context')
      return
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      let imageData: ImageData
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      } catch (e) {
        console.error('[scanner] getImageData threw', e)
        setError('Canvas access blocked. Disable fingerprinting protection.')
        return
      }
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        qrHitsRef.current += 1
        setQrHits(qrHitsRef.current)
        handleQrString(code.data)
      }
    }

    rafRef.current = requestAnimationFrame(processFrame)
  }, [handleQrString])

  useEffect(() => {
    console.log('[scanner] mount, starting camera')
    let stream: MediaStream | null = null
    canvasRef.current = document.createElement('canvas')
    doneRef.current = false

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        console.log(
          '[scanner] getUserMedia OK, tracks=',
          s.getVideoTracks().map(t => ({
            label: t.label,
            settings: t.getSettings(),
          })),
        )
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current
            .play()
            .then(() => console.log('[scanner] video.play() resolved'))
            .catch(e => console.error('[scanner] video.play() rejected', e))
          rafRef.current = requestAnimationFrame(processFrame)
        }
      })
      .catch(e => {
        console.error('[scanner] getUserMedia rejected', e)
        setError(`Camera error: ${e.name}: ${e.message}`)
      })

    return () => {
      console.log('[scanner] cleanup')
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      stream?.getTracks().forEach(t => t.stop())
      canvasRef.current = null
    }
  }, [processFrame])

  return {
    account,
    reset,
    videoRef,
    progress,
    error,
    frameCount,
    qrHits,
  }
}

function ScannerScreen({ scanner }: { scanner: UseScannerResult }) {
  const { videoRef, progress, error, frameCount, qrHits } = scanner
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
      }}
    >
      <a
        href="/onboarding"
        style={{ fontSize: 13, opacity: 0.7, textDecoration: 'none' }}
      >
        ← Back
      </a>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
        Connect a hardware wallet
      </h2>
      <p style={{ opacity: 0.7, fontSize: 14, margin: 0 }}>
        On your hardware wallet, choose <strong>Connect software wallet</strong>{' '}
        and point its screen at this camera.
      </p>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: 1,
          background: '#000',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {progress !== null && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
            }}
          >
            {progress}%
          </div>
        )}
      </div>
      <div style={{ fontSize: 11, opacity: 0.5, fontFamily: 'monospace' }}>
        frames: {frameCount} · jsQR hits: {qrHits} · progress: {progress ?? '—'}
      </div>
      {error && (
        <p
          style={{
            margin: 0,
            padding: '0.5rem',
            color: '#c00',
            fontSize: 13,
          }}
        >
          {error}
        </p>
      )}
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
        vendor: 'air-gapped',
        address: account.address,
        publicKey: account.publicKey,
        sourceFingerprint:
          account.chain === 'evm' ? account.sourceFingerprint : undefined,
      })
      await queryClient.invalidateQueries({ queryKey: ['session', 'status'] })
      await queryClient.invalidateQueries({ queryKey: ['wallets'] })
      navigate({ to: '/portfolio/assets' })
    } catch (error) {
      console.error('[import-hardware] import failed', error)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
      }}
    >
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 13,
          opacity: 0.7,
        }}
      >
        ← Back
      </button>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
        Confirm import
      </h2>
      <div
        style={{
          padding: '0.75rem',
          borderRadius: 8,
          background: 'rgba(0,0,0,0.04)',
          fontSize: 13,
          wordBreak: 'break-all',
        }}
      >
        <div style={{ opacity: 0.6, marginBottom: 4 }}>Address</div>
        <code>{account.address}</code>
      </div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Wallet name"
        style={{
          padding: '0.6rem 0.8rem',
          borderRadius: 8,
          border: '1px solid rgba(0,0,0,0.15)',
          fontSize: 14,
        }}
      />
      <button
        onClick={handleImport}
        disabled={isPending || !name.trim()}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          background: '#6750a4',
          color: '#fff',
          opacity: isPending || !name.trim() ? 0.5 : 1,
        }}
      >
        {isPending ? 'Importing…' : 'Import wallet'}
      </button>
    </div>
  )
}
