import { Button, Skeleton } from '@status-im/components'
import { SadIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { GRADIENTS } from '../../constants/gradients'
import { useInfiniteLoading } from '../../hooks/use-infinite-loading'

import type { Collectible } from '@status-im/wallet/data'
import type { ComponentType, ReactNode } from 'react'

type LinkComponentProps = {
  href: string
  className?: string
  children: ReactNode
}

type Props = {
  collectibles: Collectible[]
  address: string
  pathname: string
  search?: string
  hasNextPage?: boolean
  fetchNextPage: () => void
  isFetchingNextPage: boolean
  searchParams: URLSearchParams
  clearSearch: () => void
  LinkComponent: ComponentType<LinkComponentProps>
}

const FallbackImage = () => {
  return (
    <div className="aspect-square rounded-12 bg-white-100">
      <div className="flex h-full flex-col items-center justify-center gap-1 rounded-8 border border-dashed border-neutral-20 bg-neutral-2.5 text-13 font-semibold text-neutral-40">
        <SadIcon />
        No image available
      </div>
    </div>
  )
}

const CollectibleImage = ({ url, name }: { url: string; name: string }) => {
  return (
    <div className="relative aspect-square rounded-12 bg-neutral-10">
      <img
        src={url}
        alt={name}
        className="absolute inset-0 size-full rounded-12 object-cover"
      />
    </div>
  )
}

const CollectiblesGrid = (props: Props) => {
  const {
    collectibles,
    address,
    fetchNextPage,
    isFetchingNextPage,
    pathname,
    search,
    searchParams,
    clearSearch,
    hasNextPage,
    LinkComponent,
  } = props

  const { endOfPageRef, isLoading } = useInfiniteLoading({
    rootMargin: '200px',
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
  })

  return (
    <>
      <div className="grid grid-cols-2 gap-1 overscroll-contain lg:grid-cols-4">
        {collectibles.map(collectible => {
          const href = `/${address}/collectibles/${collectible.network}/${collectible.contract}/${collectible.id}`
          const search = searchParams.toString()
          const query = search ? `?${search}` : ''
          // Checking if the collectible.id is in the pathname by splitting the pathname and checking if the last element is the collectible.id and if it is same contract
          const isActive =
            pathname.split('/').pop() === collectible.id &&
            pathname.includes(collectible.contract)

          const imageUrl = collectible.thumbnail ?? collectible.image

          return (
            <LinkComponent
              key={
                collectible.contract +
                '_' +
                collectible.id +
                '_' +
                collectible.network
              }
              href={`${href}${query}`}
              className={cx(
                'rounded-16 border p-1 pb-0',
                isActive
                  ? 'border-customisation-blue-50/20 bg-customisation-blue-50/5'
                  : 'border-transparent',
              )}
            >
              {imageUrl ? (
                <CollectibleImage name={collectible.name} url={imageUrl} />
              ) : (
                <FallbackImage />
              )}
              <div className="flex items-center gap-1 px-1 py-2">
                {/* {collectible.collection.image && (
                  <img
                    src={collectible.collection.image}
                    alt={collectible.collection.name}
                    className="size-5 rounded-6 bg-neutral-10"
                    aria-hidden
                  />
                )} */}
                <div className="truncate text-13 font-semibold text-neutral-100">
                  {collectible.name}
                </div>
              </div>
            </LinkComponent>
          )
        })}
        {collectibles.length === 0 && !!search && (
          <div className="flex min-h-[calc(100svh-362px)] flex-1 flex-col items-center py-8 lg:col-span-2 xl:col-span-3 2xl:col-span-4">
            <h2 className="pt-[68px] text-15 font-semibold text-neutral-100 first-line:mb-0.5">
              No collectibles found
            </h2>
            <p className="mb-5 text-center text-13 font-regular text-neutral-100">
              We didn&apos;t find any collectibles that match your search
            </p>
            <Button
              variant="outline"
              target="_blank"
              size="32"
              rel="noopener noreferrer"
              onClick={clearSearch}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
      {hasNextPage && isLoading && (
        <div className="grid grid-cols-2 gap-3 overscroll-contain lg:grid-cols-4">
          {GRADIENTS.slice(0, 4).map((gradient, index) => {
            return (
              <div key={index} className="relative">
                <div
                  className="aspect-square h-[calc(100%-36px)] w-full animate-gradient-skeleton rounded-12"
                  style={{
                    background: gradient,
                    backgroundSize: '200% 200%',
                  }}
                />
                <div className="absolute top-0 aspect-square h-[calc(100%-36px)] w-full rounded-12 bg-blur-white/70" />
                <div className="flex items-center gap-1 py-2">
                  <Skeleton
                    height={20}
                    width={20}
                    className="rounded-6"
                    variant="secondary"
                  />
                  <Skeleton
                    height={20}
                    width={120}
                    className="rounded-6"
                    variant="secondary"
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
      {hasNextPage && <div ref={endOfPageRef} className="h-20" />}
    </>
  )
}

export { CollectiblesGrid }
