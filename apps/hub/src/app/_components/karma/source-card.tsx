import '@pitininja/cap-react-widget/dist/index.css'

import { useState } from 'react'

import { Skeleton, useToast } from '@status-im/components'
import { Button } from '@status-im/status-network/components'
import { useSIWE } from 'connectkit'
import dynamic from 'next/dynamic'
import { useLocale, useTranslations } from 'next-intl'
import { useAccount } from 'wagmi'

import { localeMap } from '~/i18n/locale-map'
import { clientEnv } from '~constants/env.client.mjs'
import { useClaimKarma } from '~hooks/useClaimKarma'

const CapWidget = dynamic(
  () => import('@pitininja/cap-react-widget').then(mod => mod.CapWidget),
  {
    ssr: false,
  }
)

type KarmaSourceCardProps = {
  title: string
  amount: string
  onComplete?: (token: string) => void
  isComplete?: boolean
  badgeTitle?: string
  badgeDescription?: string
  isLoading?: boolean
}

const KarmaSourceCardSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-20 border border-neutral-20 bg-white-100">
      <div className="flex flex-col">
        <div className="flex flex-col gap-6 p-4">
          <div className="flex w-full flex-col gap-0.5">
            <Skeleton height={32} width="100%" className="rounded-6" />
            <Skeleton height={24} width="100%" className="rounded-6" />
          </div>

          <Skeleton height={28} width="100%" className="rounded-6" />
        </div>

        <div className="flex items-center gap-2 border-t border-neutral-20 bg-neutral-2.5 px-4 py-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-10">
            <div className="size-4 rounded-full bg-neutral-20" />
          </div>
          <div className="flex flex-1 flex-col gap-0">
            <Skeleton height={18} width={209} className="rounded-6" />
            <Skeleton height={18} width={209} className="rounded-6" />
          </div>
        </div>
      </div>
    </div>
  )
}

const KarmaSourceCard = ({
  title,
  amount,
  onComplete,
  isComplete = false,
  badgeTitle,
  badgeDescription,
  isLoading = false,
}: KarmaSourceCardProps) => {
  const t = useTranslations()
  const locale = useLocale()
  const [capToken, setCapToken] = useState<string | null>(null)
  const [capError, setCapError] = useState<string | null>(null)
  const { isConnected, isConnecting } = useAccount()
  const { isSignedIn, isLoading: isLoadingSIWE, signIn } = useSIWE()
  const { mutateAsync: claimKarma, isPending: isClaimingKarma } =
    useClaimKarma()
  const [isClaiming, setIsClaiming] = useState<boolean>(false)
  const toast = useToast()
  const capApiEndpoint = `${clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL}/captcha/cap/`

  const defaultBadgeTitle = badgeTitle ?? t('karma.just_arrived')
  const defaultBadgeDescription =
    badgeDescription ?? t('karma.just_arrived_description')

  const formatAmount = (value: number) => {
    const numberLocale = localeMap[locale] || 'en-US'
    return value.toLocaleString(numberLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleSolve = (token: string) => {
    setCapToken(token)
    setCapError(null)
  }

  const handleError = (error?: Error) => {
    setCapError(error?.message || t('karma.captcha_error'))
    setCapToken(null)
  }

  const handleClaim = async () => {
    if (capToken && onComplete) {
      setIsClaiming(true)
      try {
        await claimKarma(
          { token: capToken },
          {
            onError: () => {
              const errorMessage = t('karma.claim_failed')
              setCapError(errorMessage)
              toast.negative(errorMessage)
            },
            onSuccess: data => {
              if (data.result.success) {
                setCapError(null)
                onComplete(capToken)
              } else {
                const errorMessage = t('karma.claim_unsuccessful')
                setCapError(errorMessage)
                toast.negative(errorMessage)
              }
            },
          }
        )
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : t('karma.unexpected_error')
        setCapError(errorMessage)
        toast.negative(errorMessage)
      } finally {
        setIsClaiming(false)
      }
    }
  }

  if (
    isConnecting ||
    isLoadingSIWE ||
    (isConnected && isSignedIn && isLoading)
  ) {
    return <KarmaSourceCardSkeleton />
  }

  if (isComplete && isConnected && isSignedIn) {
    return (
      <div className="w-full overflow-hidden rounded-20 border border-neutral-20 bg-white-100">
        <div className="flex flex-col">
          <div className="flex flex-col gap-6 p-4">
            <div className="flex w-full flex-col gap-0.5">
              <p className="text-15 font-regular text-neutral-50">{title}</p>
              <div className="flex items-center gap-2">
                <p className="text-27 font-semibold text-neutral-100">
                  {formatAmount(Number(amount))}
                </p>
                <p className="text-15 font-medium uppercase text-neutral-50">
                  Karma
                </p>
              </div>
            </div>

            <div className="invisible h-0">
              <Button
                variant="primary"
                size="40"
                disabled
                className="w-full items-center justify-center"
              >
                {t('karma.action')}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-neutral-20 bg-neutral-2.5 px-4 py-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-customisation-orange-50/20">
              <div className="size-4 rounded-full bg-customisation-orange-50/30" />
            </div>
            <div className="flex flex-1 flex-col">
              <p className="text-13 font-semibold text-neutral-100">
                {defaultBadgeTitle}
              </p>
              <p className="text-13 font-regular text-neutral-100">
                {defaultBadgeDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-[200px] w-full overflow-hidden rounded-20 border border-neutral-10 bg-white-100">
        <div className="flex h-full flex-col items-start p-4">
          <div className="flex w-full flex-col gap-0.5">
            <p className="text-15 font-regular text-neutral-50">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-27 font-semibold text-neutral-100">
                {formatAmount(Number(amount))}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex w-full flex-col gap-3">
            <CapWidget
              endpoint={capApiEndpoint}
              onSolve={handleSolve}
              onError={error => handleError(new Error(error))}
            />

            {capError && (
              <span className="text-13 font-regular text-danger-50">
                {capError}
              </span>
            )}

            {isConnected && !isSignedIn ? (
              <Button
                variant="primary"
                size="40"
                onClick={() => signIn?.()}
                className="w-full items-center justify-center"
              >
                {t('stake.sign_in_to_continue')}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="40"
                onClick={handleClaim}
                disabled={
                  !capToken ||
                  isComplete ||
                  !isConnected ||
                  isClaimingKarma ||
                  isClaiming
                }
                className="w-full items-center justify-center"
              >
                {isClaimingKarma ? t('karma.claiming') : t('karma.claim')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export { KarmaSourceCard, KarmaSourceCardSkeleton }
export type { KarmaSourceCardProps }
