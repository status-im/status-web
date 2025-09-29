type Filter<T> = {
  filterColumn: keyof T
  filterValue: string | number | Array<number | string>
  filterKey?: string
}

type TableFilterProps<T> = {
  items: T[]
  filters?: Array<Filter<T>>
}

const useTableFilters = <T extends Record<string, any>>({
  items,
  filters,
}: TableFilterProps<T>) => {
  const filteredItems = items.filter(item =>
    filters?.every(({ filterColumn, filterValue, filterKey }) => {
      const itemValue = item[filterColumn]
      if (Array.isArray(filterValue)) {
        if (Array.isArray(itemValue)) {
          return (
            filterValue.length === 0 ||
            itemValue.some((val: any) => {
              if (filterKey && typeof val === 'object') {
                return filterValue.includes(val[filterKey])
              }
              return filterValue.includes(val)
            })
          )
        }
        return filterValue.length === 0 || filterValue.includes(itemValue)
      }
      return itemValue === filterValue
    })
  )

  return {
    items: filteredItems,
  }
}

export { useTableFilters }
