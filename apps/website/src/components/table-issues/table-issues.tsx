import { Avatar, Input, Skeleton, Tag, Text } from '@status-im/components'
import { ActiveMembersIcon, OpenIcon, SearchIcon } from '@status-im/icons'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

import { useCurrentBreakpoint } from '@/hooks/use-current-breakpoint'
import { Order_By } from '@/lib/graphql/generated/schemas'

import { Empty } from './empty'
import { DropdownFilter, DropdownSort, Tabs } from './filters'

import type { DropdownSortProps } from './filters/dropdown-sort'
import type {
  GetFiltersForOrphansQuery,
  GetFiltersWithEpicQuery,
  GetIssuesByEpicQuery,
  GetOrphansQuery,
} from '@/lib/graphql/generated/operations'

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

const TableIssues = (props: Props) => {
  const currentBreakpoint = useCurrentBreakpoint()

  const {
    data = [],
    count,
    isLoading,
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

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-20 shadow-1">
      <div className="flex border-b border-neutral-20 bg-neutral-5 p-3">
        <div className="flex w-full flex-col 2xl:flex-row 2xl:justify-between">
          <Tabs
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
                      icon={<SearchIcon size={20} />}
                      size={32}
                      value={searchFilterValue}
                      onChangeText={handleSearchFilter}
                      variant="retractable"
                      direction={currentBreakpoint === '2xl' ? 'rtl' : 'ltr'}
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

      <div className="relative divide-y divide-neutral-10">
        {data.length !== 0 &&
          data.map(issue => (
            <Link
              key={issue.issue_number}
              href={issue.issue_url || ''}
              className="flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-neutral-5"
            >
              <div className="flex flex-row items-start gap-2 ">
                <div className="pt-1">
                  {issue.stage === 'open' ? (
                    <OpenIcon size={20} color="$neutral-50" />
                  ) : (
                    <ActiveMembersIcon size={20} color="$neutral-50" />
                  )}
                </div>
                <div className="flex max-w-lg flex-col">
                  <Text size={15} weight="medium" truncate>
                    {issue.title}
                  </Text>
                  <Text size={13} color="$neutral-50">
                    #{issue.issue_number} •{' '}
                    {formatDistanceToNow(new Date(issue.created_at), {
                      addSuffix: true,
                    })}{' '}
                    by {issue.author}
                  </Text>
                </div>
              </div>

              <div className="flex gap-3">
                {'epic_name' in issue && issue.epic_name && (
                  <Tag
                    size={24}
                    label={issue.epic_name || ''}
                    color={`#${issue.epic_color}` || '$primary'}
                  />
                )}

                {'labels' in issue &&
                  issue.labels &&
                  JSON.parse(issue.labels).map(
                    (label: { id: string; name: string; color: string }) => (
                      <Tag
                        key={label.id}
                        size={24}
                        label={label.name}
                        color={`#${label.color}`}
                      />
                    )
                  )}
                <Avatar type="user" size={24} name={issue.author || ''} />
              </div>
            </Link>
          ))}
        {data.length === 0 && !isLoading && (
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
    </div>
  )
}

export { TableIssues }
