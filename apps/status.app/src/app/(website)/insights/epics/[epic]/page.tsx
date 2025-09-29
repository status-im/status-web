'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { format, isDate, subDays } from 'date-fns'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { Breadcrumbs } from '~components/breadcrumbs'
import { useDebounce } from '~hooks/use-debounce'
import { useIntersectionObserver } from '~hooks/use-intersection-observer'
import { appendDateQueryParams } from '~website/_components/sidebar-menu/utils'
import { TableIssues } from '~website/insights/_components/table-issues'
import { INITIAL_DATES } from '~website/insights/_dates'
import { api } from '~website/insights/_graphql'
import {
  useGetBurnupPerEpicQuery,
  useGetEpicIssuesCountQuery,
  useGetEpicMenuLinksQuery,
  useGetFiltersWithEpicQuery,
  useGetInitialDatePerEpicQuery,
} from '~website/insights/_graphql/generated/hooks'
import { Order_By } from '~website/insights/_graphql/generated/schemas'
import { getEpicDisplayName } from '~website/insights/_utils'

import { GET_ISSUES_BY_EPIC } from '../../_operations'
import { DatePicker } from '../_components/datepicker'
import { EpicOverview } from '../_components/epic-overview'

import type {
  GetIssuesByEpicQuery,
  GetIssuesByEpicQueryVariables,
} from '~website/insights/_graphql/generated/operations'
import type { DateRange } from 'react-day-picker'

type Epic = {
  title: string
  color: `#${string}`
  description: string
  status: string
}

const LIMIT = 10

export default function EpicsDetailPage() {
  const { epic: epicLabel } = useParams() as { epic: string }

  const epicName = decodeURIComponent(epicLabel)

  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [orderByValue, setOrderByValue] = useState<Order_By>(Order_By.Desc)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const debouncedSearchFilter = useDebounce<string>(searchFilter)

  const [selectedDates, setSelectedDates] = useState<DateRange>()

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const startDate = searchParams?.get('startDate')
    const endDate = searchParams?.get('endDate')

    if (startDate && endDate) {
      setSelectedDates({
        from: new Date(startDate),
        to: new Date(endDate),
      })
    }
  }, [searchParams])

  const { data: epicLinks } = useGetEpicMenuLinksQuery({
    where: {
      epic_name: { _eq: epicName as string },
    },
  })

  const epicLinkExists = epicLinks?.gh_epics.find(
    link => link.epic_name === epicName
  )

  const breadcrumbs = [
    {
      label: 'Epics',
      href: appendDateQueryParams('/insights/epics'),
    },
    {
      label: getEpicDisplayName(epicName),
      href: `/insights/epics/${epicName}`,
    },
  ]

  const { data: initialDate } = useGetInitialDatePerEpicQuery(
    {
      epicName: String(epicName),
    },
    {
      // enabled: router.isReady && !selectedDates?.from,
    }
  )

  const initialDateFrom = subDays(
    new Date(initialDate?.gh_epic_issues[0]?.created_at),
    1
  )

  const { isFetching: isLoadingBurnup, data: burnup } =
    useGetBurnupPerEpicQuery(
      {
        epicName: String(epicName),
        from: isDate(selectedDates?.from)
          ? format(selectedDates.from, 'yyyy-MM-dd')
          : initialDateFrom,
        to: isDate(selectedDates?.to)
          ? format(selectedDates?.to, 'yyyy-MM-dd')
          : INITIAL_DATES.to,
      },
      {
        // Prevent animation if we go out of the page
        refetchOnWindowFocus: false,
        // enabled: router.isReady,
      }
    )

  const { data: dataCounter, isLoading: isLoadingCount } =
    useGetEpicIssuesCountQuery(
      {
        where: {
          epic_name: { _eq: epicName as string },
          ...(selectedAuthors.length > 0 && {
            author: { _in: selectedAuthors },
          }),
          ...(selectedAssignees.length > 0 && {
            assignee: { _in: selectedAssignees },
          }),
          ...(selectedRepos.length > 0 && {
            repository: { _in: selectedRepos },
          }),
          title: { _ilike: `%${debouncedSearchFilter}%` },
        },
      },
      {
        // enabled: router.isReady,
      }
    )

  const count = {
    total: dataCounter?.gh_epic_issues.length,
    closed: dataCounter?.gh_epic_issues.filter(issue => issue.closed_at).length,
    open: dataCounter?.gh_epic_issues.filter(issue => !issue.closed_at).length,
  }

  const startDate = isDate(selectedDates?.from)
    ? format(selectedDates.from, 'yyyy-MM-dd')
    : INITIAL_DATES.from

  const endDate = isDate(selectedDates?.to)
    ? format(selectedDates.to, 'yyyy-MM-dd')
    : INITIAL_DATES.to

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        'getIssuesByEpic',
        epicName,
        activeTab,
        selectedAssignees,
        selectedRepos,
        selectedAuthors,
        orderByValue,
        debouncedSearchFilter,
        startDate,
        endDate,
      ],
      queryFn: async ({ pageParam = 0 }) => {
        const result = await api<
          GetIssuesByEpicQuery,
          GetIssuesByEpicQueryVariables
        >(GET_ISSUES_BY_EPIC, {
          where: {
            epic_name: { _eq: epicName as string },
            stage: { _eq: activeTab },
            ...(selectedAuthors.length > 0 && {
              author: { _in: selectedAuthors },
            }),
            ...(selectedAssignees.length > 0 && {
              assignee: { _in: selectedAssignees },
            }),
            ...(selectedRepos.length > 0 && {
              repository: { _in: selectedRepos },
            }),
            title: { _ilike: `%${debouncedSearchFilter}%` },
            ...(startDate &&
              endDate && {
                created_at: {
                  _gte: startDate,
                  _lte: endDate,
                },
              }),
          },
          limit: LIMIT,
          offset: pageParam,
          orderBy: orderByValue,
        })

        return result?.gh_epic_issues || []
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

  const { data: filters } = useGetFiltersWithEpicQuery(
    {
      epicName: epicName as string,
    },
    {
      // enabled: router.isReady,
    }
  )

  const issues = useMemo(
    () => data?.pages.flatMap(page => page) || [],
    [data?.pages]
  )

  const endOfPageRef = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(endOfPageRef, {
    rootMargin: '800px',
  })
  const isVisible = !!entry?.isIntersecting

  useEffect(() => {
    if (isVisible && !isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isVisible])

  // useEffect(() => {
  //   if (!epicLinkExists && !isLoading) {
  //     router.push('/insights/epics')
  //   }
  // }, [epicLinkExists, router, isLoading])

  const onSelect = useCallback(
    (selected?: DateRange) => {
      setSelectedDates(selected)

      const encodedEpicName = encodeURIComponent(epicName)

      const searchParams = new URLSearchParams()
      if (isDate(selected?.from)) {
        searchParams.set('startDate', format(selected.from, 'yyyy-MM-dd'))
      }
      if (isDate(selected?.to)) {
        searchParams.set('endDate', format(selected.to, 'yyyy-MM-dd'))
      }

      const url = `/insights/epics/${encodedEpicName}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      router.push(url)
    },
    [epicName, router]
  )

  const epic: Epic = {
    title: String(epicName) || '-',
    description: epicLinkExists?.epic_description || '',
    color: epicLinkExists?.epic_color
      ? `#${epicLinkExists.epic_color}`
      : '#4360df',
    status: epicLinkExists?.status || '',
  }

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

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div className="px-10 py-6">
        <EpicOverview
          title={epic.title}
          description={epic.description}
          color={epic.color}
          status={epic.status}
          fullscreen
          burnup={getBurnupData()}
          isLoading={isLoadingBurnup || !epicName}
        />
      </div>
      <div className="flex-1 border-neutral-10 px-10 py-6">
        <TableIssues
          data={issues}
          count={count}
          isLoadingCount={isLoadingCount || !epicName}
          isLoading={isFetchingNextPage || isFetching || hasNextPage}
          filters={filters}
          handleTabChange={setActiveTab}
          activeTab={activeTab}
          selectedAuthors={selectedAuthors}
          handleSelectedAuthors={setSelectedAuthors}
          selectedAssignees={selectedAssignees}
          handleSelectedAssignees={setSelectedAssignees}
          selectedRepos={selectedRepos}
          handleSelectedRepos={setSelectedRepos}
          orderByValue={orderByValue}
          handleOrderByValue={setOrderByValue}
          searchFilterValue={searchFilter}
          handleSearchFilter={setSearchFilter}
        />
        <div ref={endOfPageRef} />
      </div>
      <div className="sticky bottom-4 z-10 flex justify-center">
        <div className="inline-flex">
          <DatePicker selected={selectedDates} onSelect={onSelect} />
        </div>
      </div>
    </>
  )
}
