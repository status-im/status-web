import { useEffect, useMemo, useRef, useState } from 'react'

import { Input, Shadow, Tag, Text } from '@status-im/components'
import { DoneIcon, OpenIcon, SearchIcon } from '@status-im/icons'
import { useInfiniteQuery } from '@tanstack/react-query'
import { differenceInCalendarDays, format } from 'date-fns'

import { Loading } from '@/components/chart/components'
import { DatePicker } from '@/components/datepicker/datepicker'
import { EpicOverview } from '@/components/epic-overview'
import { Empty } from '@/components/table-issues/empty'
import { DropdownSort } from '@/components/table-issues/filters'
import { useDebounce } from '@/hooks/use-debounce'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { RenderIfVisible } from '@/hooks/use-render-if-visible'
import { InsightsLayout } from '@/layouts/insights-layout'
import { GET_BURNUP, GET_EPIC_LINKS } from '@/lib/burnup'
import { api } from '@/lib/graphql'
import { Order_By } from '@/lib/graphql/generated/schemas'

import type { DropdownSortProps } from '@/components/table-issues/filters/dropdown-sort'
import type {
  GetBurnupQuery,
  GetBurnupQueryVariables,
  GetEpicMenuLinksQuery,
  GetEpicMenuLinksQueryVariables,
} from '@/lib/graphql/generated/operations'
import type { DateRange } from '@status-im/components/src/calendar/calendar'
import type { Page } from 'next'

type Props = {
  links: string[]
}

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

const EpicsPage: Page<Props> = props => {
  const { links } = props
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    'In Progress',
  ])

  const [orderByValue, setOrderByValue] = useState<Order_By>(Order_By.Desc)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const debouncedSearchFilter = useDebounce<string>(searchFilter)

  const [selectedDates, setSelectedDates] = useState<DateRange>()

  const handleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter))
    } else {
      setSelectedFilters([...selectedFilters, filter])
    }
  }

  const {
    data,
    isFetchedAfterMount,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [
      'getEpicsOverview',
      orderByValue,
      debouncedSearchFilter,
      selectedDates,
      selectedFilters,
    ],
    async ({ pageParam = 0 }) => {
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

      const burnup = await api<GetBurnupQuery, GetBurnupQueryVariables>(
        GET_BURNUP,
        {
          epicNames: result?.gh_epics.map(epic => epic.epic_name || '') || [],
          from: selectedDates?.from || '2018-05-01',
          to: selectedDates?.to || format(new Date(), 'yyyy-MM-dd'),
        }
      )

      const differenceBetweenSelectedDates = differenceInCalendarDays(
        selectedDates?.to || new Date(),
        selectedDates?.from || new Date()
      )

      const rate = 50 // 1 sample per 50 days

      let samplingRate = rate // Use the default rate as the initial value

      if (differenceBetweenSelectedDates > 0) {
        // Calculate the ratio between the difference in days and the desired sampling rate
        const ratio = differenceBetweenSelectedDates / rate

        // Calculate the sampling rate based on the ratio
        samplingRate = Math.ceil(1 / ratio)
      }

      // Downsampling the burnup data
      const downsampledData: GetBurnupQuery['gh_burnup'] = []

      burnup?.gh_burnup.forEach((dataPoint, index) => {
        if (index % samplingRate === 0) {
          downsampledData.push(dataPoint)
        }
      })

      return (
        result?.gh_epics.map(epic => {
          const burnupData = downsampledData?.filter(
            b => b.epic_name === epic.epic_name
          )

          return {
            title: epic.epic_name,
            description: epic.epic_description,
            color: epic.epic_color ? `#${epic.epic_color}` : '#4360df',
            burnup:
              burnupData.length > 0
                ? burnupData
                : [
                    {
                      date: selectedDates?.from,
                      total_closed_issues: 0,
                      total_open_issues: 0,
                    },
                    {
                      date: selectedDates?.to,
                      total_closed_issues: 0,
                      total_open_issues: 0,
                    },
                  ],
          }
        }) || []
      )
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < LIMIT) {
          return undefined
        }

        return pages.length * LIMIT
      },
    }
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
    <InsightsLayout links={links}>
      <div className="flex h-full flex-1 flex-col justify-between">
        <div className="space-y-4 p-10">
          <Text size={27} weight="semibold">
            Epics
          </Text>

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Tag
                size={32}
                label="In Progress"
                icon={OpenIcon}
                selected={selectedFilters.includes('In Progress')}
                onPress={() => handleFilter('In Progress')}
              />
              <Tag
                size={32}
                label="Closed"
                icon={DoneIcon}
                selected={selectedFilters.includes('Closed')}
                onPress={() => handleFilter('Closed')}
              />
            </div>

            <div className="flex gap-2">
              <Input
                direction="rtl"
                variant="retractable"
                placeholder="Search"
                icon={<SearchIcon size={20} />}
                size={32}
                value={searchFilter}
                onChangeText={setSearchFilter}
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
                  <Shadow
                    variant="$2"
                    className="h-[398px] rounded-2xl px-4 py-3"
                  >
                    <div className="flex h-full flex-col p-5">
                      <Loading />
                    </div>
                  </Shadow>
                }
              >
                <Shadow variant="$2" className="rounded-2xl px-4 py-3">
                  <EpicOverview
                    title={epic.title || ''}
                    description={epic.description || ''}
                    selectedDates={selectedDates}
                    setSelectedDates={setSelectedDates}
                    showPicker={false}
                    color={epic.color as `#${string}`}
                    burnup={epic.burnup}
                    isLoading={!isFetchedAfterMount}
                  />
                </Shadow>
              </RenderIfVisible>
            ))}
            <div ref={endOfPageRef} />

            {(isFetching || isFetchingNextPage || hasNextPage) && (
              <Shadow
                variant="$2"
                className="mt-[-1rem] h-[398px] rounded-2xl px-4 py-3"
              >
                <div className="flex h-full flex-col p-5">
                  <Loading />
                </div>
              </Shadow>
            )}

            {!isFetching && !isFetchingNextPage && epics.length === 0 && (
              <div className="pt-4">
                <Empty />
              </div>
            )}
          </div>
        </div>
        <DatePicker selected={selectedDates} onSelect={setSelectedDates} />
      </div>
    </InsightsLayout>
  )
}

export async function getServerSideProps() {
  const epics = await api<
    GetEpicMenuLinksQuery,
    GetEpicMenuLinksQueryVariables
  >(GET_EPIC_LINKS)

  return {
    props: {
      links:
        epics?.gh_epics
          .filter(epic => epic.status === 'In Progress')
          .map(epic => epic.epic_name) || [],
    },
  }
}

export default EpicsPage
