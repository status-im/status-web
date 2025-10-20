import { pluralize } from '~admin/_utils'

import { EmptySearchResults } from '../_components/empty-search-results'
import { ListHeader } from '../_components/list-header'

import type { Segments } from '~admin/_contexts/layout-context'

type AdminLayoutListProps = {
  children: React.ReactNode
  segment: Segments
  action?: React.ReactNode
}

const AdminLayoutList = (props: AdminLayoutListProps) => {
  const { segment, children, action = null } = props

  return (
    <div>
      <ListHeader variant={segment}>{action}</ListHeader>
      {children}
    </div>
  )
}

type FiltersProps = {
  children: React.ReactNode
}

const Filters = (props: FiltersProps) => {
  const { children } = props

  return (
    <div className="flex flex-col gap-3 pb-2">
      <div className="flex flex-row items-stretch gap-2">{children}</div>
    </div>
  )
}

type TableResultsProps = {
  segment: Segments
  itemsCount: number
  children: React.ReactNode
  onClear: () => void
}

const TableResults = (props: TableResultsProps) => {
  const { itemsCount, segment, onClear, children } = props
  return itemsCount > 0 ? (
    <>
      <div className="py-3 text-13 font-medium text-neutral-100">
        {pluralize(itemsCount, segment.slice(0, -1))}
      </div>
      {children}
    </>
  ) : (
    <EmptySearchResults segment={segment} onClear={onClear} />
  )
}

AdminLayoutList.Filters = Filters
AdminLayoutList.TableResults = TableResults

export { AdminLayoutList }
