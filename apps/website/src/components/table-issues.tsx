import { Avatar, Skeleton, Tag, Text } from '@status-im/components'
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
  const { data, count, isLoading } = props

  const issues = data || []

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-10 transition-opacity">
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
                  {formatDistanceToNow(new Date(issue.created_at), {
                    addSuffix: true,
                  })}{' '}
                  by {issue.author}
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
                <Avatar type="user" size={24} name={issue.author || ''} />
              </div>
            </Link>
          ))}
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
