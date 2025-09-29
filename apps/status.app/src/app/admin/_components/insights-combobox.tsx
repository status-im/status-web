'use client'

import { useMemo, useState } from 'react'

import * as Popover from '@radix-ui/react-popover'
import { Checkbox, Input, Tag } from '@status-im/components'
import { SearchIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { matchSorter } from 'match-sorter'

import { getColorWithOpacity } from '~app/_utils/get-color-with-opacity'

import type { ApiOutput } from '~server/api/types'

// We choose to use status from projects because it has the all the used statuses in the app plus "paused" status
type Status = ApiOutput['projects']['byId']['status']

type Props = {
  children: React.ReactNode
  items: Array<{
    id: number
    name: string
    color: string
    status: Status
    icon?: React.ReactNode
  }>
  placeholder?: string
  selection: number[]
  onSelectionChange: (selection: number[]) => void
}

const TAGS_FILTERS = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  paused: 'Paused',
  done: 'Done',
} as const

const InsightsCombobox = (props: Props) => {
  const { children, items, selection, onSelectionChange, placeholder } = props

  const [open, setOpen] = useState(false)

  const [searchFilter, setSearchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status>('not-started')

  const filteredItems = useMemo(() => {
    const filteredByStatus = items.filter(item => item.status === statusFilter)

    if (searchFilter === '') {
      return filteredByStatus
    }

    return matchSorter(filteredByStatus, searchFilter, {
      keys: ['name'],
    })
  }, [items, searchFilter, statusFilter])

  const availableStatuses = useMemo(() => {
    const statusesSet = new Set(items.map(item => item.status))
    return Array.from(statusesSet)
  }, [items])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="pointer-events-auto relative z-50 max-h-[274px] w-[352px] overflow-auto rounded-12 bg-white-100 shadow-3"
          align="start"
          sideOffset={4}
        >
          <div className="sticky top-0 bg-blur-white/70 p-2 pb-1 backdrop-blur-[20px]">
            <Input
              placeholder={placeholder || 'Search'}
              icon={<SearchIcon />}
              size="32"
              value={searchFilter}
              onChange={setSearchFilter}
            />
          </div>
          {filteredItems.length === 0 ? (
            <div className="px-3 pb-12 pt-2 text-15 font-medium text-neutral-50">
              No results found.
            </div>
          ) : (
            <div className="flex flex-col overflow-y-auto p-1 pb-12">
              {filteredItems.map(item => {
                return (
                  <label
                    key={item.id}
                    className={cx(
                      'flex min-h-[32px] cursor-pointer select-none items-center justify-between gap-2 rounded-10 px-2 text-15 font-500 transition-colors hover:bg-neutral-10'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 items-center justify-center">
                        {item.icon ? (
                          item.icon
                        ) : (
                          <div
                            className={cx(
                              'flex size-[14px] shrink-0 items-center rounded-full border-[1.2px]'
                            )}
                            style={{
                              backgroundColor: getColorWithOpacity(
                                item.color,
                                0.4
                              ),
                              borderColor: item.color,
                            }}
                          />
                        )}
                      </div>

                      {item.name}
                    </div>
                    <div className={cx('flex shrink-0 items-center')}>
                      <Checkbox
                        id={item.id.toString()}
                        variant="outline"
                        checked={selection.includes(item.id)}
                        onCheckedChange={checked => {
                          onSelectionChange(
                            checked
                              ? [...selection, item.id]
                              : selection.filter(id => id !== item.id)
                          )
                        }}
                      />
                    </div>
                  </label>
                )
              })}
            </div>
          )}
          <div className="fixed bottom-0 flex w-full gap-2 rounded-b-12 bg-blur-white/70 p-3 backdrop-blur-[20px]">
            {availableStatuses.map(status => {
              return (
                <Tag
                  key={status}
                  size="24"
                  label={TAGS_FILTERS[status]}
                  onClick={() => setStatusFilter(status)}
                  selected={statusFilter === status}
                />
              )
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export { InsightsCombobox }
