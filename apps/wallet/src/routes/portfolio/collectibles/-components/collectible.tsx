import { useEffect } from 'react'

import { Button, useToast } from '@status-im/components'
import {
  ArrowLeftIcon,
  ExternalIcon,
  // OptionsIcon,
  SadIcon,
} from '@status-im/icons/20'
import { OpenseaIcon } from '@status-im/icons/social'
import {
  CollectibleSkeleton,
  // CurrencyAmount,
  NetworkLogo,
} from '@status-im/wallet/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { CardDetail } from './card-detail'

import type { NetworkType } from '@status-im/wallet/data'

type Props = {
  network: NetworkType
  contract: string
  id: string
}

const Collectible = (props: Props) => {
  const { network, contract, id } = props

  const toast = useToast()

  const {
    data: collectible,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['collectible', network, contract, id],
    queryFn: async () => {
      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/collectibles.collectible`,
      )
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            contract,
            tokenId: id,
            network,
          },
        }),
      )

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(response.statusText, { cause: response.status })
      }

      const body = await response.json()
      return body.result.data.json
    },
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 60 * 60 * 1000, // 1 hour
  })

  // Show error toast if fetching fails
  useEffect(() => {
    if (isError) {
      toast.negative(ERROR_MESSAGES.COLLECTIBLE_INFO)
    }
  }, [isError, toast])

  if (isLoading || !collectible) {
    return <CollectibleSkeleton />
  }

  const imageUrl = collectible.thumbnail || collectible.image
  const imageAlt = collectible.name || 'Collectible image'

  return (
    <div className="relative flex h-[calc(100vh-56px)] w-full flex-col overflow-auto p-4 pr-3 2xl:p-12">
      <Link
        to="/portfolio/collectibles"
        viewTransition
        className="z-30 flex items-center gap-1 py-4 font-600 text-neutral-50 transition-colors hover:text-neutral-60 xl:hidden 2xl:mt-0 2xl:p-12 2xl:pt-0"
      >
        <ArrowLeftIcon />
        Back
      </Link>
      <div className="mb-10 flex gap-4">
        <div className="flex-1">
          <div className="2xl:mb-6">
            <div className="mb-2 flex items-center gap-1.5">
              <div className="text-15 font-semibold text-neutral-100">
                {collectible.collection.name}
              </div>
            </div>

            <div className="mb-6 2xl:mt-0">
              <div className="text-27 font-semibold text-neutral-100">
                {collectible.name}
              </div>
            </div>

            {/* {collectible.floor_price && collectible.price_eur && (
              <div className="mb-6 flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <div className="text-13 font-medium text-neutral-50">
                    {collectible.floor_price} {collectible.currency}
                  </div>
                  <div
                    className="size-0.5 rounded-full bg-neutral-40"
                    aria-hidden
                  />
                  <div className="text-13 font-medium text-neutral-50">
                    <CurrencyAmount
                      value={collectible.price_eur}
                      format="standard"
                    />
                  </div>
                </div>
              </div>
            )} */}

            <div className="flex gap-2">
              <Button
                size="32"
                variant="outline"
                iconBefore={<OpenseaIcon className="text-social-opensea" />}
                iconAfter={<ExternalIcon />}
                href={collectible.links.opensea}
              >
                View on OpenSea
              </Button>
              {/* <Button
                size="32"
                variant="outline"
                icon={<OptionsIcon />}
                aria-label="More options"
              /> */}
            </div>
          </div>
        </div>

        {imageUrl ? (
          <div className="aspect-square size-[140px] rounded-16">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="size-full rounded-16 object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-square size-[140px] flex-col items-center justify-center gap-1 rounded-16 border border-dashed border-neutral-20 bg-neutral-2.5 p-1 text-13 font-semibold text-neutral-40">
            <SadIcon />
            No image available
          </div>
        )}
      </div>

      <div className="grid gap-8">
        <div>
          <div className="mb-1 text-15 font-semibold text-neutral-100">
            About
          </div>
          <div className="mb-5">{collectible.about}</div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-3 pb-8">
            <CardDetail title="Network">
              <div className="flex items-center gap-1">
                <NetworkLogo name={collectible.network} size={16} />
                <div className="capitalize">{collectible.network}</div>
              </div>
            </CardDetail>
            {collectible.standard !== 'NOT_A_CONTRACT' && (
              <>
                <CardDetail
                  title="Contract"
                  href={`https://etherscan.io/address/${collectible.contract}`}
                >
                  <div className="font-mono">
                    {truncateAddress(collectible.contract)}
                  </div>
                </CardDetail>
                <CardDetail title="Token Standard">
                  <div className="font-mono">{collectible.standard}</div>
                </CardDetail>
              </>
            )}
            {collectible.collection.size && (
              <CardDetail title="Collection size">
                <div>{collectible.collection.size}</div>
              </CardDetail>
            )}
          </div>
        </div>
      </div>

      <div
        className="h-px w-full border-t border-dashed border-neutral-20 pb-8"
        aria-hidden="true"
      />

      {collectible.traits && (
        <div>
          <div className="mb-3 text-15 font-semibold text-neutral-100">
            Traits
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-3">
            {Object.entries(collectible.traits as Record<string, string>).map(
              ([trait, value], index) => (
                <CardDetail key={index} title={trait}>
                  <div className="text-13 font-medium text-neutral-100">
                    {value}
                  </div>
                </CardDetail>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { Collectible }

const truncateAddress = (address: string, chars = 5) =>
  `${address.slice(0, chars)}...${address.slice(-chars)}`
