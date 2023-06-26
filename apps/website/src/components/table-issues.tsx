import { useEffect } from 'react'

import { Avatar, Tag, Text } from '@status-im/components'
import { useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

import type {
  GetIssuesByEpicQuery,
  GetOrphansQuery,
} from '@/lib/graphql/generated/operations'

type Props = {
  isLoading?: boolean
  data?: GetOrphansQuery['gh_orphans'] | GetIssuesByEpicQuery['gh_epic_issues']
  count?: {
    total: number
    closed: number
    open: number
  }
}

// function isOrphans(
//   data: GetOrphansQuery['gh_orphans'] | GetIssuesByEpicQuery['gh_epic_issues']
// ): data is GetOrphansQuery['gh_orphans'] {
//   return 'labels' in data[0]
// }

function isIssues(
  data: GetOrphansQuery['gh_orphans'] | GetIssuesByEpicQuery['gh_epic_issues']
): data is GetIssuesByEpicQuery['gh_epic_issues'] {
  return 'assignee' in data[0]
}

export const TableIssues = (props: Props) => {
  const { data, count } = props

  const issues = data || []

  const queryClient = useQueryClient()

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(['getIssuesByEpic'])
    }
  }, [queryClient])

  return (
    <div
      style={{
        opacity: props.isLoading ? 0.5 : 1,
      }}
      className="overflow-hidden rounded-2xl border border-neutral-10 transition-opacity"
    >
      <div className="border-b border-neutral-10 bg-neutral-5 p-3">
        <Text size={15} weight="medium">
          {count?.open || 0} Open
        </Text>

        <Text size={15} weight="medium">
          {count?.closed || 0} Closed
        </Text>
      </div>

      <div className="divide-y divide-neutral-10">
        {issues.length !== 0 &&
          isIssues(issues) &&
          issues.map(issue => (
            <Link
              key={issue.issue_number}
              href={`https://github.com/status-im/${issue.repository}/issues/${issue.issue_number}`}
              className="flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-neutral-5"
            >
              <div className="flex flex-col">
                <Text size={15} weight="medium">
                  {issue.title}
                </Text>
                <Text size={13} color="$neutral-50">
                  #{issue.issue_number} •{' '}
                  {formatDistanceToNow(new Date(issue.created_at))} ago by{' '}
                  {issue.author}
                </Text>
              </div>

              <div className="flex gap-3">
                <div className="flex gap-1">
                  <Tag
                    size={24}
                    label={issue.epic_name || ''}
                    color={`#${issue.epic_color}` || '$primary'}
                  />
                </div>
                <Tag size={24} label="9435" />
                <Avatar type="user" size={24} name={issue.author || ''} />
              </div>
            </Link>
          ))}
      </div>

      {/* <div className="p-3">
        <Button size={40} variant="outline">
          Show more 10
        </Button>
      </div> */}
    </div>
  )
}
