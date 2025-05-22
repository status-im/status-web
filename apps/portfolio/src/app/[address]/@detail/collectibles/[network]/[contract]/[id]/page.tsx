// import { Suspense } from 'react'

import { Button } from '@status-im/components'
import { ExternalIcon, OptionsIcon, SadIcon } from '@status-im/icons/20'
import { OpenseaIcon } from '@status-im/icons/social'
import { CurrencyAmount, NetworkLogo } from '@status-im/wallet/components'

import { api } from '../../../../../../../data/api'
import { ImageLightbox } from './_components/image-lightbox'
import { InfoCard } from './_components/info-card'

import type { NetworkType } from '@status-im/wallet/data'

type Props = {
  params: Promise<{
    network: NetworkType
    contract: string
    id: string
  }>
  // searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function CollectiblesDetailPage(props: Props) {
  const { params } = props
  const { network, contract, id } = await params

  // const searchParams = await props.searchParams
  // const networks = searchParams['networks']?.split(',') ?? [
  //   'ethereum',
  //   'optimism',
  //   'arbitrum',
  //   'base',
  //   'polygon',
  //   'bsc',
  // ]
  // const keyHash = JSON.stringify({
  //   route: 'ticker',
  //   networks,
  // })

  return (
    // <Suspense
    //   // note: comment to prevent loading fallback for the whole slot
    //   // note: when commented disables fallback for the other slot
    //   key={keyHash}
    //   fallback={<div>Loading...</div>}
    // >
    <Collectible network={network} contract={contract} id={id} />
    // </Suspense>
  )
}

async function Collectible({
  network,
  contract,
  id,
}: {
  network: NetworkType
  contract: string
  id: string
}) {
  const collectible = await api.collectibles.collectible({
    contract,
    tokenId: id,
    network,
  })

  return (
    <div className="overflow-auto p-4 pr-3 2xl:p-12">
      <div className="mb-10 flex gap-4">
        <div className="flex-1">
          <div className="2xl:mb-6">
            <div className="mb-2 flex items-center gap-1.5">
              {/* {collectible.collection.image && (
                <img
                  src={collectible.collection.image}
                  alt={collectible.collection.name}
                  className="size-5 rounded-6"
                />
              )} */}

              <div className="text-15 font-semibold text-neutral-100">
                {collectible.collection.name}
              </div>
            </div>

            <div className="mb-1 mt-6 2xl:mt-0">
              <div className="text-27 font-semibold text-neutral-100">
                {collectible.name}
              </div>
            </div>

            {collectible.floor_price && collectible.price_eur && (
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
            )}

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
              <Button
                size="32"
                variant="outline"
                icon={<OptionsIcon />}
                aria-label="More options"
              />
            </div>
          </div>
        </div>

        {collectible.image && collectible.thumbnail ? (
          <ImageLightbox
            thumbnailSrc={collectible.thumbnail}
            fullSizeSrc={collectible.image}
            name={collectible.name}
            openSeaUrl={collectible.links.opensea}
            // etherscanUrl={`https://etherscan.io/token/${collectible.contract}?a=${collectible.id}`}
          />
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

          <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-3">
            <InfoCard
              label="Network"
              value={
                <div className="flex items-center gap-1">
                  <NetworkLogo name={collectible.network} size={16} />
                  <span className="capitalize">{collectible.network}</span>
                </div>
              }
            />
            {collectible.standard !== 'NOT_A_CONTRACT' && (
              <>
                <InfoCard
                  label="Contract"
                  value={collectible.contract}
                  fontStyle="mono"
                  url={`https://etherscan.io/address/${collectible.contract}`}
                />
                <InfoCard label="Token Standard" value={collectible.standard} />
              </>
            )}
            {collectible.collection.size && (
              <InfoCard
                label="Collection Size"
                value={collectible.collection.size}
              />
            )}
          </div>
        </div>

        <div
          className="h-px w-full border-t border-dashed border-neutral-20"
          aria-hidden="true"
        />

        {collectible.traits && (
          <div>
            <div className="mb-3 text-15 font-semibold text-neutral-100">
              Traits
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-3">
              {Object.entries(collectible.traits).map(
                ([trait, value], index) => (
                  <InfoCard key={index} label={trait} value={value} />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
