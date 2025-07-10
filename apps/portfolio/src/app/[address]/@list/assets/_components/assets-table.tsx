'use client'

import { AssetsList } from '@status-im/wallet/components'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

import { useSearchAndSort } from '../../../../_hooks/use-search-and-sort'

import type { ApiOutput } from '@status-im/wallet/data'

type Props = {
  assets: ApiOutput['assets']['all']['assets']
}

const AssetsTable = (props: Props) => {
  const { assets } = props

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { address } = useParams()

  const { clearSearch } = useSearchAndSort()

  return (
    <AssetsList
      assets={assets}
      pathname={pathname}
      onSelect={url => {
        const ticker = url.split('/').pop()
        if (!ticker) return
        router.push(`/${address}/assets/${ticker}`)
      }}
      searchParams={searchParams}
      clearSearch={clearSearch}
    />
  )
}

export { AssetsTable }
