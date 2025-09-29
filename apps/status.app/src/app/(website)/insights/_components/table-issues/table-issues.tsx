'use client'

import { Avatar, Input, Popover, Skeleton, Text } from '@status-im/components'
import { DoneIcon, OpenIcon, SearchIcon } from '@status-im/icons/20'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useMediaQuery } from '~hooks/use-media-query'
import { Order_By } from '~website/insights/_graphql/generated/schemas'

import { Empty } from './empty'
import { DropdownFilter, DropdownSort, Tabs } from './filters'
import { Tag as InsightsTag } from './tag'

import type { DropdownSortProps } from './filters/dropdown-sort'
import type {
  GetFiltersForOrphansQuery,
  GetFiltersWithEpicQuery,
  GetIssuesByEpicQuery,
  GetOrphansQuery,
} from '~website/insights/_graphql/generated/operations'

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

type Props = {
  isLoading?: boolean
  isLoadingCount?: boolean
  data?: GetOrphansQuery['gh_orphans'] | GetIssuesByEpicQuery['gh_epic_issues']
  filters?: GetFiltersWithEpicQuery | GetFiltersForOrphansQuery
  count?: {
    total?: number
    closed?: number
    open?: number
  }
  activeTab: 'open' | 'closed'
  handleTabChange: (tab: 'open' | 'closed') => void
  selectedAuthors: string[]
  handleSelectedAuthors: (values: string[]) => void
  selectedAssignees: string[]
  handleSelectedAssignees: (values: string[]) => void
  selectedRepos: string[]
  handleSelectedRepos: (values: string[]) => void
  orderByValue: Order_By
  handleOrderByValue: (value: Order_By) => void
  handleSearchFilter: (value: string) => void
  searchFilterValue: string
}

type Label = { id: string; name: string; color: string }

const NUMBER_OF_LABELS_TO_SHOW = 3
const NUMBER_OF_LABELS_TO_SHOW_IN_SMALLER_SCREENS = 1

const TableIssues = (props: Props) => {
  const router = useRouter()
  const matches2XL = useMediaQuery('2xl')

  const {
    data = [],
    count,
    isLoading,
    isLoadingCount,
    filters,
    handleTabChange,
    activeTab,
    selectedAuthors,
    handleSelectedAuthors,
    selectedAssignees,
    handleSelectedAssignees,
    selectedRepos,
    handleSelectedRepos,
    orderByValue,
    handleOrderByValue,
    handleSearchFilter,
    searchFilterValue,
  } = props

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleOnPressTag = ({
    repo,
    label,
  }: {
    repo: string
    label: string
  }) => {
    // Check if label it's an epic and starts with E:. If so, send to epic page
    const isEpicLabel = label.startsWith('E:')

    if (isEpicLabel) {
      router.push(`/insights/epics/${encodeURIComponent(label)}`)
    } else {
      // Otherwise, send to label page on github repository
      // example: https://github.com/status-im/status-desktop/labels/messenger-team
      if (repo) {
        openInNewTab(`https://github.com/${repo}/labels/${label}`)
      }
    }
  }

  const numberOfLabelsToShow = matches2XL
    ? NUMBER_OF_LABELS_TO_SHOW
    : NUMBER_OF_LABELS_TO_SHOW_IN_SMALLER_SCREENS

  return (
    <div className="overflow-hidden rounded-16 border border-neutral-20 shadow-1">
      <div className="flex border-b border-neutral-20 bg-neutral-5 p-3">
        <div className="flex w-full flex-col 2xl:flex-row 2xl:justify-between">
          <Tabs
            isLoading={isLoadingCount}
            onTabChange={handleTabChange}
            activeTab={activeTab}
            count={{
              closed: count?.closed,
              open: count?.open,
            }}
          />
          <div className="flex-1">
            <div className="flex items-center 2xl:justify-end">
              <div className="flex w-full justify-between pt-4 2xl:justify-end 2xl:pt-0">
                <div className="flex gap-2">
                  <div className="transition-all">
                    <Input
                      placeholder="Find issue..."
                      icon={<SearchIcon />}
                      size="32"
                      value={searchFilterValue}
                      onChange={handleSearchFilter}
                      // variant="retractable"
                      // direction={matches2XL ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <DropdownFilter
                    onSelectedValuesChange={handleSelectedAuthors}
                    selectedValues={selectedAuthors}
                    data={
                      filters?.authors.map(author => {
                        return {
                          id: author.author || '',
                          name: author.author || '',
                          avatar: `https://github.com/${author.author}.png`,
                        }
                      }) || []
                    }
                    label="Author"
                    placeholder="Find author "
                  />
                  <DropdownFilter
                    onSelectedValuesChange={handleSelectedAssignees}
                    selectedValues={selectedAssignees}
                    data={
                      filters?.assignees.map(assignee => {
                        return {
                          id: assignee.assignee || '',
                          name: assignee.assignee || '',
                          avatar: `https://github.com/${assignee.assignee}.png`,
                        }
                      }) || []
                    }
                    label="Assignee"
                    placeholder="Find assignee"
                  />
                  <DropdownFilter
                    onSelectedValuesChange={handleSelectedRepos}
                    selectedValues={selectedRepos}
                    data={
                      filters?.repos.map(repo => {
                        return {
                          id: repo.repository || '',
                          name: repo.repository || '',
                        }
                      }) || []
                    }
                    label="Repos"
                    placeholder="Find repo"
                  />
                </div>
                <div className="pl-2">
                  <DropdownSort
                    data={sortOptions}
                    onOrderByValueChange={handleOrderByValue}
                    orderByValue={orderByValue}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative p-1">
        {data.length !== 0 &&
          data.map(issue => {
            const hasLabels = 'labels' in issue
            const labelsReceived =
              hasLabels && issue.labels ? JSON.parse(issue.labels) : []

            const labels = labelsReceived.filter((label: Label) => {
              if ('epic_name' in issue) {
                return label.name !== issue.epic_name
              }
              return true
            })

            const author = issue.author || ''
            const repo = issue.repository || ''

            return (
              <div
                key={issue.issue_number}
                className="flex items-center justify-between rounded-12 border border-transparent px-4 py-3 transition-all hover:border-neutral-10 hover:bg-neutral-5"
              >
                <div className="flex flex-row items-start gap-2">
                  <div className="shrink-0 pt-1 text-neutral-50">
                    {issue.stage === 'open' ? <OpenIcon /> : <DoneIcon />}
                  </div>
                  <div className="flex max-w-md flex-col">
                    <Link
                      href={issue.issue_url || ''}
                      className="group"
                      target="_blank"
                      rel="noopener,noreferrer"
                    >
                      <div className="flex max-w-xs group-hover:underline 2xl:max-w-sm">
                        <Text size={15} weight="medium" truncate>
                          {issue.title}
                        </Text>
                      </div>
                    </Link>
                    <Text size={13} color="$neutral-50">
                      #{issue.issue_number} •{' '}
                      {formatDistanceToNow(new Date(issue.created_at), {
                        addSuffix: true,
                      })}{' '}
                      by{' '}
                      <Link
                        href={`https://github.com/${author}`}
                        className="group"
                        target="_blank"
                        rel="noopener,noreferrer"
                      >
                        <div className="inline-flex group-hover:underline">
                          {author}
                        </div>
                      </Link>
                    </Text>
                  </div>
                </div>

                <div className="flex gap-1">
                  {labels
                    .map((label: Label) => {
                      const isInternal = label.name.startsWith('E:')

                      return (
                        <InsightsTag
                          {...(isInternal && {
                            variant: 'internal',
                          })}
                          key={label.id}
                          label={label.name}
                          color={`#${label.color}`}
                          onClick={() => {
                            handleOnPressTag({
                              repo,
                              label: label.name,
                            })
                          }}
                        />
                      )
                    })
                    .slice(0, numberOfLabelsToShow)}

                  {labels.length > numberOfLabelsToShow && (
                    <Popover.Root>
                      <button className="flex h-6 items-center rounded-[24px] border border-neutral-20 px-2 text-neutral-50 transition-all duration-200 active:border-neutral-40 data-[state=open]:border-neutral-40 data-[state=open]:bg-neutral-10 hover:border-neutral-30 hover:bg-neutral-10">
                        +${labels.length - numberOfLabelsToShow}
                      </button>

                      <Popover.Content
                        align="end"
                        alignOffset={0}
                        sideOffset={8}
                      >
                        <div className="flex max-w-sm flex-wrap gap-1 p-2">
                          {labels
                            .map((label: Label) => {
                              const isInternal = label.name.startsWith('E:')

                              return (
                                <InsightsTag
                                  {...(isInternal && {
                                    variant: 'internal',
                                  })}
                                  key={label.id}
                                  label={label.name}
                                  color={`#${label.color}`}
                                  onClick={() => {
                                    handleOnPressTag({
                                      repo,
                                      label: label.name,
                                    })
                                  }}
                                />
                              )
                            })
                            .slice(numberOfLabelsToShow)}
                        </div>
                      </Popover.Content>
                    </Popover.Root>
                  )}
                  <Link
                    href={`https://github.com/${author}`}
                    target="_blank"
                    rel="noopener,noreferrer"
                    className="pl-2"
                  >
                    <Avatar
                      type="user"
                      size="24"
                      name={author}
                      src={`https://github.com/${author}.png`}
                    />
                  </Link>
                </div>
              </div>
            )
          })}
      </div>
      {data.length === 0 && isLoading === false && (
        <div className="py-11">
          <Empty />
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex h-10 grow flex-col justify-between">
            <Skeleton width={340} height={18} />
            <Skeleton width={200} height={12} />
          </div>
          <div className="flex flex-auto flex-row justify-end gap-2">
            <Skeleton width={85} height={24} />
            <Skeleton width={24} height={24} />
          </div>
        </div>
      )}
    </div>
  )
}

export { TableIssues }
