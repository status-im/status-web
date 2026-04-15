import { Button } from '@status-im/components'
import {
  ArrowLeftIcon,
  ExternalIcon,
  // OptionsIcon,
  SadIcon,
  SendBlurIcon,
} from '@status-im/icons/20'
import { OpenseaIcon } from '@status-im/icons/social'
import {
  CollectibleSkeleton,
  // CurrencyAmount,
  NetworkLogo,
  shortenAddress,
} from '@status-im/wallet/components'
import { Link } from '@tanstack/react-router'

import { useWallet } from '@/providers/wallet-context'

import { CardDetail } from './card-detail'
import { CollectibleTraits } from './collectible-traits'
import { isSupportedNftStandard } from './nft-helpers'
import { SendCollectibleModal } from './send-collectible-modal'
import { useCollectible } from './use-collectible'

import type { NetworkType } from '@status-im/wallet/data'

type Props = {
  network: NetworkType
  contract: string
  id: string
}

const Collectible = (props: Props) => {
  const { network, contract, id } = props

  const { currentWallet } = useWallet()
  const address = currentWallet?.activeAccounts[0]?.address

  const { data: collectible, isLoading } = useCollectible(network, contract, id)

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
            {collectible.collection.name && (
              <div className="mb-2 flex items-center gap-1.5">
                <div className="text-15 font-semibold text-neutral-100">
                  {collectible.collection.name}
                </div>
              </div>
            )}

            <div className="mb-6 2xl:mt-0">
              <div className="text-27 font-semibold text-neutral-100">
                {collectible.displayName}
              </div>
            </div>

            <div className="flex gap-2">
              {collectible?.links?.opensea && (
                <Button
                  size="32"
                  variant="outline"
                  iconBefore={<OpenseaIcon className="text-social-opensea" />}
                  iconAfter={<ExternalIcon />}
                  href={collectible.links.opensea}
                >
                  View on OpenSea
                </Button>
              )}
              {isSupportedNftStandard(collectible.standard) &&
                address &&
                currentWallet?.id && (
                  <SendCollectibleModal
                    standard={collectible.standard}
                    displayName={collectible.displayName}
                    collectibleImage={
                      collectible.thumbnail || collectible.image || undefined
                    }
                    fromAddress={address}
                    walletId={currentWallet.id}
                    accountName={currentWallet.name || 'Account 1'}
                    network={network}
                    contract={contract}
                    tokenId={id}
                  >
                    <Button
                      size="32"
                      variant="outline"
                      iconBefore={<SendBlurIcon />}
                    >
                      Send
                    </Button>
                  </SendCollectibleModal>
                )}
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
                    {shortenAddress(collectible.contract)}
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
        <CollectibleTraits
          traits={collectible.traits as Record<string, unknown>}
        />
      )}
    </div>
  )
}

export { Collectible }
