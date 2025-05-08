'use client'

import { Input } from '@status-im/components'
import { SearchIcon } from '@status-im/icons/20'
import { useParams, usePathname } from 'next/navigation'
import { match, P } from 'ts-pattern'

import { useSearchAndSort } from '../_hooks/use-search-and-sort'
import { AdminDropdownSort } from './dropdown-sort'
import { TabLink } from './tab-link'

const checkPathnameAndReturnTabValue = (
  pathname: string
): 'assets' | 'collectibles' => {
  return match(pathname)
    .with(P.string.includes('/assets'), () => 'assets')
    .with(P.string.includes('/collectibles'), () => 'collectibles')
    .otherwise(() => 'assets') as 'assets' | 'collectibles'
}

const placeholderText = {
  assets: 'Search asset name or symbol',
  collectibles: 'Search collection or collectible name',
} as const

const ActionButtons = () => {
  const { address } = useParams()
  const pathname = usePathname()

  const placeholder = placeholderText[checkPathnameAndReturnTabValue(pathname)]

  const {
    inputValue,
    updateSearchParam,
    orderByColumn,
    ascending,
    onOrderByChange,
    sortOptions,
  } = useSearchAndSort()

  return (
    <div className="flex place-content-between">
      <div className="flex gap-1.5">
        <TabLink href={`/${address}/assets`}>Assets</TabLink>
        <TabLink href={`/${address}/collectibles`}>Collectibles</TabLink>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder={placeholder}
          icon={<SearchIcon />}
          size="32"
          value={inputValue}
          onChange={updateSearchParam}
          clearable={!!inputValue}
          aria-label="Search"
        />
        <AdminDropdownSort
          data={sortOptions}
          onOrderByChange={onOrderByChange}
          orderByColumn={orderByColumn}
          ascending={ascending}
        />
      </div>
    </div>
  )
}

export { ActionButtons }
