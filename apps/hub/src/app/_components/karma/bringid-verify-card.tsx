'use client'

import { useState } from 'react'

import { Skeleton, useToast } from '@status-im/components'
import { Button } from '@status-im/status-network/components'
import { useSIWE } from 'connectkit'
import { useTranslations } from 'next-intl'
import { useAccount } from 'wagmi'

import { useBringID } from '~providers/bringid-provider'

type BringIDVerifyCardProps = {
  amount?: string
  onComplete?: () => Promise<void>
  isLoading?: boolean
}

export function BringIDVerifyCard({
  amount = '0',
  onComplete,
  isLoading = false,
}: BringIDVerifyCardProps) {
  const t = useTranslations()
  const bringid = useBringID()
  const { isConnected, isConnecting } = useAccount()
  const { isSignedIn, isLoading: isLoadingSIWE, signIn } = useSIWE()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const toast = useToast()

  const handleVerify = async () => {
    if (!bringid) return

    setIsVerifying(true)

    try {
      const { proofs, points } = await bringid.verifyHumanity()
      console.log({ proofs, points })
      // you can check the proofs validity via server before any action
      // example is shown here https://github.com/BringID/status-demo-serivce

      setIsVerified(true)
      toast.positive(t('karma.bringid_verify_success'))
      await onComplete?.()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('karma.unexpected_error')
      toast.negative(message)
    } finally {
      setIsVerifying(false)
    }
  }

  const formattedAmount = Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  if (
    isConnecting ||
    isLoadingSIWE ||
    (isConnected && isSignedIn && isLoading)
  ) {
    return <BringIDVerifyCardSkeleton />
  }

  const needsSignIn = isConnected && !isSignedIn

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-20 border border-neutral-20 bg-white-100">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col gap-6 p-4">
          <div className="flex w-full flex-col gap-0.5">
            <p className="text-15 font-regular text-neutral-50">
              {t('karma.bringid_verify_title')}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-27 font-semibold text-neutral-100">
                {formattedAmount}
              </p>
              <p className="text-15 font-medium uppercase text-neutral-50">
                TKARMA
              </p>
            </div>
          </div>

          {needsSignIn ? (
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
              onClick={handleVerify}
              disabled={isVerifying || isVerified || !bringid}
              className="w-full items-center justify-center"
            >
              {isVerifying
                ? t('karma.bringid_verifying')
                : isVerified
                  ? t('karma.bringid_verify_done')
                  : t('karma.bringid_verify_button')}
            </Button>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-neutral-20 bg-neutral-2.5 px-4 py-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-customisation-orange-50/20">
          <div className="size-4 rounded-full bg-customisation-orange-50/30" />
        </div>
        <div className="flex flex-1 flex-col">
          <p className="text-13 font-semibold text-neutral-100">
            {t('karma.bringid_badge_title')}
          </p>
          <p className="text-13 font-regular text-neutral-100">
            {t('karma.bringid_badge_description')}
          </p>
        </div>
      </div>
    </div>
  )
}

export function BringIDVerifyCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-20 border border-neutral-20 bg-white-100">
      <div className="flex flex-col">
        <div className="flex flex-col gap-6 p-4">
          <div className="flex w-full flex-col gap-0.5">
            <Skeleton height={24} width="60%" className="rounded-6" />
            <Skeleton height={32} width="40%" className="rounded-6" />
          </div>
          <Skeleton height={40} width="100%" className="rounded-12" />
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
