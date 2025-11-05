import { useEffect, useRef, useState } from 'react'

import { Button } from '@status-im/status-network/components'
import Script from 'next/script'
import { useAccount } from 'wagmi'

import { clientEnv } from '~constants/env.client.mjs'

type KarmaSourceCardProps = {
  title: string
  amount: number
  onClaim?: (token: string) => void
  isClaimed?: boolean
}

const KarmaSourceCard = ({
  title,
  amount,
  onClaim,
  isClaimed = false,
}: KarmaSourceCardProps) => {
  const [capToken, setCapToken] = useState<string | null>(null)
  const [capError, setCapError] = useState<string | null>(null)
  const capWidgetRef = useRef<HTMLElement>(null)
  const { isConnected } = useAccount()
  const capApiEndpoint = `${clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL}/captcha/cap/`

  const formatAmount = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  useEffect(() => {
    const widget = capWidgetRef.current

    if (!widget) return

    const handleSolve = (event: Event) => {
      const solveEvent = event as Event & {
        detail: { token: string }
      }
      setCapToken(solveEvent.detail.token)
      setCapError(null)
    }

    const handleError = (event: Event) => {
      const errorEvent = event as Event & {
        detail: { error: Error }
      }
      setCapError(errorEvent.detail.error.message)
      setCapToken(null)
    }

    const handleReset = () => {
      setCapToken(null)
      setCapError(null)
    }

    widget.addEventListener('solve', handleSolve)
    widget.addEventListener('error', handleError)
    widget.addEventListener('reset', handleReset)

    return () => {
      widget.removeEventListener('solve', handleSolve)
      widget.removeEventListener('error', handleError)
      widget.removeEventListener('reset', handleReset)
    }
  }, [])

  const handleClaim = () => {
    if (capToken && onClaim) {
      onClaim(capToken)
    }
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@cap.js/widget@0.1.31"
        strategy="lazyOnload"
      />
      <div className="h-[200px] w-full overflow-hidden rounded-20 border border-neutral-10 bg-white-100">
        <div className="flex h-full flex-col items-start p-4">
          <div className="flex w-full flex-col gap-0.5">
            <p className="text-15 font-regular text-neutral-50">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-27 font-semibold text-neutral-100">
                {formatAmount(amount)}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex w-full flex-col gap-3">
            {/* @ts-expect-error - cap-widget is not a valid HTML element */}
            <cap-widget
              ref={capWidgetRef}
              data-cap-api-endpoint={capApiEndpoint}
              onSolve={(token: string) => console.log('Solved', token)}
              onError={(error: Error) => console.log('Error', error)}
            />

            {capError && (
              <span className="text-13 font-regular text-danger-50">
                {capError}
              </span>
            )}

            <Button
              variant="primary"
              size="40"
              onClick={handleClaim}
              disabled={!capToken || isClaimed || !isConnected}
              className="w-full items-center justify-center"
            >
              Claim
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export { KarmaSourceCard }
export type { KarmaSourceCardProps }
