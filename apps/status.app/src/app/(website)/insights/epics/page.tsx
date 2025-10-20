'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Input, Tag, Text } from '@status-im/components'
import {
  DoneIcon,
  NotStartedIcon,
  OpenIcon,
  SearchIcon,
} from '@status-im/icons/20'
import { useInfiniteQuery } from '@tanstack/react-query'
import { format, isDate, subDays } from 'date-fns'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useDebounce } from '~hooks/use-debounce'
import { useIntersectionObserver } from '~hooks/use-intersection-observer'
import { RenderIfVisible } from '~hooks/use-render-if-visible'
import { api } from '~website/insights/_graphql'
import {
  type GetBurnupPerEpicQuery,
  type GetBurnupPerEpicQueryVariables,
  type GetEpicMenuLinksQuery,
  type GetEpicMenuLinksQueryVariables,
  type GetInitialDatePerEpicQuery,
  type GetInitialDatePerEpicQueryVariables,
} from '~website/insights/_graphql/generated/operations'
import { Order_By } from '~website/insights/_graphql/generated/schemas'

import {
  DropdownSort,
  type DropdownSortProps,
} from '../_components/table-issues/filters/dropdown-sort'
import { INITIAL_DATES } from '../_dates'
import {
  GET_BURNUP,
  GET_EPIC_LINKS,
  GET_INITIAL_DATE_PER_EPIC,
} from '../_operations'
import { Empty, Loading } from './_components/chart/components'
import { DatePicker } from './_components/datepicker'
import { EpicOverview } from './_components/epic-overview'

import type { DateRange } from 'react-day-picker'

const LIMIT = 3

const sortOptions: DropdownSortProps['data'] = [
  {
    id: Order_By.Asc,
    name: 'Ascending',
  },
  {
    id: Order_By.Desc,
    name: 'Descending',
  },
]

export default function EpicsPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    'In Progress',
  ])

  const [orderByValue, setOrderByValue] = useState<Order_By>(Order_By.Asc)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const debouncedSearchFilter = useDebounce<string>(searchFilter)

  const [selectedDates, setSelectedDates] = useState<DateRange>()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams) {
      return
    }

    const status = searchParams.get('status')
    if (status) {
      setSelectedFilters(status.split(','))
    }

    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    setSelectedDates({
      from: startDate ? new Date(startDate) : undefined,
      to: endDate ? new Date(endDate) : undefined,
    })
  }, [searchParams])

  const handleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter))
      const newStatus = selectedFilters.filter(f => f !== filter)
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('status', newStatus.join(','))
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    } else {
      const newStatus = [...selectedFilters, filter]
      setSelectedFilters(newStatus)
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('status', newStatus.join(','))
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }

  const {
    data,
    isFetchedAfterMount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [
      'getEpicsOverview',
      orderByValue,
      debouncedSearchFilter,
      selectedDates,
      selectedFilters,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await api<
        GetEpicMenuLinksQuery,
        GetEpicMenuLinksQueryVariables
      >(GET_EPIC_LINKS, {
        where: {
          status: {
            _in:
              selectedFilters.length > 0
                ? selectedFilters
                : ['In Progress', 'Closed'],
          },
          epic_name: { _ilike: `%${debouncedSearchFilter}%` },
        },
        limit: LIMIT,
        offset: pageParam,
        orderBy: {
          epic_name: orderByValue || Order_By.Asc,
        },
      })

      const epic = result?.gh_epics.map(async epic => {
        const epicName = epic.epic_name || ''
        const { gh_epic_issues } = await api<
          GetInitialDatePerEpicQuery,
          GetInitialDatePerEpicQueryVariables
        >(GET_INITIAL_DATE_PER_EPIC, {
          epicName,
        })

        const burnup = await api<
          GetBurnupPerEpicQuery,
          GetBurnupPerEpicQueryVariables
        >(GET_BURNUP, {
          epicName,
          from: isDate(selectedDates?.from)
            ? format(selectedDates.from, 'yyyy-MM-dd')
            : subDays(new Date(gh_epic_issues[0]?.created_at), 1),
          to: isDate(selectedDates?.to)
            ? format(selectedDates?.to, 'yyyy-MM-dd')
            : INITIAL_DATES.to,
        })

        const getBurnupData = () => {
          if (burnup?.gh_burnup_per_epic) {
            if (burnup.gh_burnup_per_epic.length === 1) {
              return burnup.gh_burnup_per_epic.concat({
                date: selectedDates?.to || INITIAL_DATES.to,
                total_closed: burnup.gh_burnup_per_epic[0].total_closed,
                total_opened: burnup.gh_burnup_per_epic[0].total_opened,
              })
            } else {
              return burnup.gh_burnup_per_epic
            }
          }
          return [
            {
              date: selectedDates?.from || INITIAL_DATES.from,
              total_closed: 0,
              total_opened: 0,
            },
            {
              date: selectedDates?.to || INITIAL_DATES.to,
              total_closed: 0,
              total_opened: 0,
            },
          ]
        }

        return {
          title: epic.epic_name!,
          description: epic.epic_description,
          color: epic.epic_color ? `#${epic.epic_color}` : '#4360df',
          status: epic.status || '',
          burnup: getBurnupData(),
        }
      })

      return Promise.all(epic)
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < LIMIT) {
        return undefined
      }

      return pages.length * LIMIT
    },
    // enabled: router.isReady,
    initialPageParam: 0,
  })

  const onSelect = useCallback(
    (selected?: DateRange) => {
      setSelectedDates(selected)

      const searchParams = new URLSearchParams()
      if (isDate(selected?.from)) {
        searchParams.set('startDate', format(selected.from, 'yyyy-MM-dd'))
      }
      if (isDate(selected?.to)) {
        searchParams.set('endDate', format(selected.to, 'yyyy-MM-dd'))
      }

      const url = `/insights/epics${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      router.push(url)
    },
    [router]
  )

  const epics = useMemo(() => {
    return data?.pages.flatMap(page => page) || []
  }, [data])

  const endOfPageRef = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(endOfPageRef, {})
  const isVisible = !!entry?.isIntersecting

  useEffect(() => {
    if (isVisible && !isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isVisible])

  return (
    <div className="relative flex h-full flex-1 flex-col justify-between">
      <div className="relative space-y-4 p-10">
        <Text size={27} weight="semibold">
          Epics
        </Text>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Tag
              size="32"
              label="In Progress"
              icon={<OpenIcon />}
              selected={selectedFilters.includes('In Progress')}
              onPress={() => handleFilter('In Progress')}
            />
            <Tag
              size="32"
              label="Closed"
              icon={<DoneIcon />}
              selected={selectedFilters.includes('Closed')}
              onPress={() => handleFilter('Closed')}
            />
            <Tag
              size="32"
              label="Not Started"
              icon={<NotStartedIcon />}
              selected={selectedFilters.includes('Not Started')}
              onPress={() => handleFilter('Not Started')}
            />
          </div>

          <div className="flex gap-2">
            <Input
              // direction="rtl"
              // variant="retractable"
              placeholder="Search"
              icon={<SearchIcon />}
              size="32"
              value={searchFilter}
              onChange={setSearchFilter}
            />
            <DropdownSort
              data={sortOptions}
              onOrderByValueChange={setOrderByValue}
              orderByValue={orderByValue}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {epics.map(epic => (
            <RenderIfVisible
              key={epic.title}
              defaultHeight={398}
              placeholderComponent={
                <div className="h-[398px] rounded-16 px-4 py-3 shadow-2">
                  <div className="flex h-full flex-col p-5">
                    <Loading />
                  </div>
                </div>
              }
            >
              <div className="rounded-16 px-4 py-3 shadow-2">
                <Link
                  href={{
                    pathname: `/insights/epics/${encodeURIComponent(
                      epic.title
                    )}`,
                    query: {
                      ...(isDate(selectedDates?.from) && {
                        startDate: format(selectedDates?.from, 'yyyy-MM-dd'),
                      }),
                      ...(isDate(selectedDates?.to) && {
                        endDate: format(selectedDates?.to, 'yyyy-MM-dd'),
                      }),
                    },
                  }}
                >
                  <EpicOverview
                    title={epic.title}
                    description={epic.description || ''}
                    status={epic.status || ''}
                    color={epic.color as `#${string}`}
                    burnup={
                      epic.burnup as GetBurnupPerEpicQuery['gh_burnup_per_epic']
                    }
                    isLoading={!isFetchedAfterMount}
                  />
                </Link>
              </div>
            </RenderIfVisible>
          ))}
          <div ref={endOfPageRef} />

          {(isLoading || isFetchingNextPage || hasNextPage) && (
            <div className="-mt-4 h-[398px] rounded-16 px-4 py-3 shadow-2">
              <div className="flex h-full flex-col p-5">
                <Loading />
              </div>
            </div>
          )}

          {hasNextPage === false && epics.length === 0 && (
            <div className="pt-4">
              <Empty />
            </div>
          )}
        </div>
      </div>
      <div className="sticky bottom-4 z-10 flex justify-center">
        <div className="inline-flex">
          <DatePicker selected={selectedDates} onSelect={onSelect} />
        </div>
      </div>
    </div>
  )
}
