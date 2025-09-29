import { useState } from 'react'

import { matchSorter } from 'match-sorter'

type TableSortProps<T extends Record<string, unknown>> = {
  items: T[]
  searchColumn: keyof T
  searchFilter: string
  initialOrderByColumn: keyof T
}

const useTableSort = <T extends Record<string, unknown>>({
  items,
  searchColumn,
  searchFilter,
  initialOrderByColumn,
}: TableSortProps<T>) => {
  const [orderByColumn, setOrderByColumn] =
    useState<keyof T>(initialOrderByColumn)
  const [ascending, setAscending] = useState<boolean | undefined>()

  const onOrderByChange = (value: keyof T, ascending: boolean) => {
    setOrderByColumn(value)
    setAscending(ascending)
  }

  let filteredItems = items

  if (searchFilter !== '') {
    filteredItems = matchSorter(items, searchFilter, {
      keys: [searchColumn as string],
    })
  }

  if (orderByColumn) {
    filteredItems = filteredItems.sort((a, b) => {
      if (!ascending) {
        return String(a[orderByColumn]).localeCompare(String(b[orderByColumn]))
      } else {
        return String(b[orderByColumn]).localeCompare(String(a[orderByColumn]))
      }
    })
  }

  return {
    items: filteredItems,
    onOrderByChange,
    ascending,
    orderByColumn,
  }
}

export { useTableSort }
