import { Button } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/20'

import { getAPIClient } from '../../../../data/api'
import { Image } from '../../../_components/assets'
import { DEFAULT_SORT } from '../../../_constants'
import { getCollectibles } from './_actions'
import { CollectiblesGrid } from './_components/collectibles-table'

import type { NetworkType } from '@status-im/wallet/data'

// export const experimental_ppr = true

type Props = {
  params: Promise<{
    address: string
  }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function CollectiblesPage(props: Props) {
  const address = (await props.params).address
  const searchParams = await props.searchParams

  const networks = searchParams['networks']?.split(',') ?? ['ethereum']

  const search = searchParams['search'] ?? undefined
  const sortParam = searchParams['sort']?.split(',') ?? [
    DEFAULT_SORT.collectibles.column,
    DEFAULT_SORT.collectibles.direction,
  ]

  const sort = {
    column: sortParam[0] as 'name' | 'collection',
    direction: sortParam[1] as 'asc' | 'desc',
  }

  const apiClient = await getAPIClient()

  const { collectibles, hasMore } = await apiClient.collectibles.page({
    address,
    networks: networks as NetworkType[],
    limit: 20,
    offset: 0,
    search,
    sort,
  })

  return (
    <div className="min-h-[calc(100svh-366px)]">
      {collectibles.length === 0 ? (
        <div className="flex flex-col items-center rounded-16 border border-neutral-10 py-8">
          <div className="mb-4 size-24">
            <Image
              id="Portfolio/Empty States/No_Collectibles:161:160"
              alt=""
              height={161}
              width={160}
            />
          </div>
          <h2 className="mb-0.5 text-15 font-semibold text-neutral-100">
            No collectibles
          </h2>
          <p className="mb-5 text-13 font-regular text-neutral-100">
            {"Don't be a bored ape"}
          </p>
          <Button
            href="https://opensea.io"
            target="_blank"
            size="32"
            rel="noopener noreferrer"
            iconBefore={<ExternalIcon />}
          >
            OpenSea
          </Button>
        </div>
      ) : (
        <CollectiblesGrid
          address={address}
          initialCollectibles={collectibles}
          networks={networks as NetworkType[]}
          getCollectibles={getCollectibles}
          hasMore={hasMore}
        />
      )}
    </div>
  )
}
