'use client'

import { AssetsList } from '@status-im/wallet/components'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

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

  const { clearSearch } = useSearchAndSort()

  return (
    <AssetsList
      assets={assets}
      pathname={pathname}
      onSelect={router.push}
      searchParams={searchParams}
      clearSearch={clearSearch}
    />
  )
}

export { AssetsTable }
