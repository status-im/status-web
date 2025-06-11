'use client'

// import { Input } from '@status-im/components'
// import { SearchIcon } from '@status-im/icons/20'
import { DropdownSort } from '@status-im/wallet/components'

// import { match, P } from 'ts-pattern'
import { TabLink } from './tab-link'

// const checkPathnameAndReturnTabValue = (
//   pathname: string,
// ): 'assets' | 'collectibles' => {
//   return match(pathname)
//     .with(P.string.includes('/assets'), () => 'assets')
//     .with(P.string.includes('/collectibles'), () => 'collectibles')
//     .otherwise(() => 'assets') as 'assets' | 'collectibles'
// }

// const placeholderText = {
//   assets: 'Search asset name or symbol',
//   collectibles: 'Search collection or collectible name',
// } as const

type Props = {
  address: string
  pathname: string
  searchAndSortValues: {
    inputValue: string
    updateSearchParam: (value: string) => void
    orderByColumn: string
    ascending: boolean
    onOrderByChange: (value: string | number, ascending: boolean) => void
    sortOptions: Record<string, string>
  }
}

const ActionButtons = (props: Props) => {
  //   const { address, pathname, searchAndSortValues } = props
  const { address, searchAndSortValues } = props

  //   const placeholder = placeholderText[checkPathnameAndReturnTabValue(pathname)]

  return (
    <div className="flex place-content-between">
      <div className="flex gap-1.5">
        <TabLink href={`/${address}/assets`}>Assets</TabLink>
        <TabLink href={`/${address}/collectibles`}>Collectibles</TabLink>
      </div>
      <div className="flex items-center gap-2">
        {/* <Input
          placeholder={placeholder}
          icon={<SearchIcon />}
          size="32"
          value={searchAndSortValues.inputValue}
          onChange={searchAndSortValues.updateSearchParam}
          clearable={!!searchAndSortValues.inputValue}
          aria-label="Search"
        /> */}
        <DropdownSort
          data={searchAndSortValues.sortOptions}
          onOrderByChange={searchAndSortValues.onOrderByChange}
          orderByColumn={searchAndSortValues.orderByColumn}
          ascending={searchAndSortValues.ascending}
        />
      </div>
    </div>
  )
}

export { ActionButtons }
