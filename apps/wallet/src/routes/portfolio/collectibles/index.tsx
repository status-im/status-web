import { CollectiblesGrid as CollectiblesList } from '@status-im/wallet/components'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useCollectibles } from '@/hooks/use-collectibles'
import { LinkCollectible } from '@/routes/portfolio/collectibles/-components/link-collectibe'

export const Route = createFileRoute('/portfolio/collectibles/')({
  component: Component,
  head: () => ({
    meta: [
      {
        title: 'Extension | Wallet | Portfolio',
      },
    ],
  }),
})

function Component() {
  const router = useRouter()

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined

  const pathname = window.location.pathname
  // todo?: replace address
  const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'

  const { data, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } =
    useCollectibles({
      address,
    })

  const collectibles = useMemo(() => {
    return data?.pages.flatMap(page => page.collectibles ?? []) ?? []
  }, [data?.pages])

  return (
    <SplittedLayout
      list={
        <CollectiblesList
          LinkComponent={LinkCollectible}
          address={address}
          collectibles={collectibles}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          pathname={pathname}
          search={search}
          searchParams={searchParams}
          clearSearch={() => {
            // Clear the search input
            console.log('Search cleared')
          }}
          hasNextPage={hasNextPage}
          onSelect={url => {
            const [network, contract, id] = url.split('/').slice(-3)
            router.navigate({
              to: '/portfolio/collectibles/$network/$contract/$id',
              params: { network, contract, id },
            })
          }}
        />
      }
      isLoading={isLoading}
    />
  )
}
