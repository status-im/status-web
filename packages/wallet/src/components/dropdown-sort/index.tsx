'use client'

import { DropdownMenu, IconButton } from '@status-im/components'
import { ArrowDownIcon, ArrowTopIcon, SortIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

type Data = {
  [id: string]: string
}

type Props<T> = {
  data: Data
  orderByColumn: keyof T
  ascending?: boolean
  onOrderByChange: (value: keyof T, ascending: boolean) => void
}

type SortItemProps<T> = {
  id: keyof T
  name: string
  orderByColumn: keyof T
  ascending?: boolean
  onSelect: (value: keyof T, ascending: boolean) => void
}

// move to components library as part of dropdown menu
const SortItem = <T,>(props: SortItemProps<T>) => {
  const { id, name, orderByColumn, ascending, onSelect } = props

  const selectedFilterAsc = orderByColumn === id && ascending
  const selectedFilterDesc = orderByColumn === id && !ascending
  const notSelectedFilter = orderByColumn !== id

  return (
    <div key={id as string} className="rounded-10 px-2 py-1 hover:bg-neutral-5">
      <div className="group flex flex-row items-center justify-between gap-2 text-15 font-medium">
        <span className="select-none">{name}</span>
        <div className="flex flex-row gap-1">
          <button
            className={cx(
              'hidden aria-[current=true]:flex group-hover:flex',
              selectedFilterAsc && 'opacity-[100%]',
              selectedFilterDesc && 'opacity-[50%] hover:opacity-[100%]',
              notSelectedFilter && 'opacity-[50%] hover:opacity-[100%]',
            )}
            aria-current={selectedFilterAsc}
            onClick={() => onSelect(id, true)}
          >
            <ArrowTopIcon
              className={
                selectedFilterAsc
                  ? 'text-customisation-blue-50'
                  : 'text-neutral-100'
              }
            />
          </button>
          <button
            className={cx(
              'hidden aria-[current=true]:flex group-hover:flex',
              selectedFilterDesc && 'opacity-[100%]',
              selectedFilterAsc && 'opacity-[50%] hover:opacity-[100%]',
              notSelectedFilter && 'opacity-[50%] hover:opacity-[100%]',
            )}
            aria-current={selectedFilterDesc}
            onClick={() => onSelect(id, false)}
          >
            <ArrowDownIcon
              className={
                selectedFilterDesc
                  ? 'text-customisation-blue-50'
                  : 'text-neutral-100'
              }
            />
          </button>
        </div>
      </div>
    </div>
  )
}

const DropdownSort = <T,>(props: Props<T>) => {
  const { data, orderByColumn, ascending, onOrderByChange } = props

  const onChange = (value: keyof T, ascending: boolean) => {
    onOrderByChange(value, ascending)
  }

  return (
    <DropdownMenu.Root>
      <IconButton icon={<SortIcon />} variant="outline" />
      <DropdownMenu.Content className="!w-[256px]">
        {Object.entries(data).map(([id, name]) => {
          return (
            <SortItem
              key={id}
              id={id as keyof T}
              name={name}
              orderByColumn={orderByColumn}
              ascending={ascending}
              onSelect={onChange}
            />
          )
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export { DropdownSort }
