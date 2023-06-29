import { useEffect, useMemo, useRef, useState } from 'react'

import { Input, Shadow, Tag, Text } from '@status-im/components'
import { DoneIcon, OpenIcon, SearchIcon } from '@status-im/icons'
import { useInfiniteQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

import { DatePicker } from '@/components/datepicker/datepicker'
import { EpicOverview } from '@/components/epic-overview'
import { DropdownSort } from '@/components/table-issues/filters'
import { useDebounce } from '@/hooks/use-debounce'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
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

const LIMIT = 1

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
    'Closed',
    // 'Not Started',
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
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
            status: { _in: selectedFilters },
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
            from: selectedDates?.from || '2017-01-01',
            to: selectedDates?.to || format(new Date(), 'yyyy-MM-dd'),
          }
        )

        return (
          result?.gh_epics.map(epic => {
            console.log()
            return {
              title: epic.epic_name,
              description: epic.epic_description,
              color: epic.epic_color ? `#${epic.epic_color}` : '#4360df',
              burnup: burnup?.gh_burnup.filter(
                b => b.epic_name === epic.epic_name
              ),
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
            {/* <Tag
              size={32}
              label="Not Started"
              icon={NotStartedIcon}
              selected={selectedFilters.includes('Not Started')}
              onPress={() => handleFilter('Not Started')}
            /> */}
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
            <Shadow
              key={epic.title}
              variant="$2"
              className="rounded-2xl px-4 py-3"
            >
              <EpicOverview
                title={epic.title || ''}
                description={epic.description || ''}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                showPicker={false}
                color={epic.color as `#${string}`}
                burnup={epic.burnup}
              />
            </Shadow>
          ))}
        </div>
        <div ref={endOfPageRef} />
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
