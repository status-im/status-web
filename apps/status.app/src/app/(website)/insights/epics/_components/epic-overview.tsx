import { Skeleton, Text } from '@status-im/components'
import { DoneIcon, NotStartedIcon, OpenIcon } from '@status-im/icons/20'

import { Tag } from '~website/insights/_components/table-issues/tag'

import { getEpicDisplayName } from '../../_utils'
import { Chart } from './chart'

import type { GetBurnupPerEpicQuery } from '~website/insights/_graphql/generated/operations'

type Props = {
  title: string
  description?: string
  color?: `#${string}`
  status?: string
  fullscreen?: boolean
  isLoading?: boolean
  burnup?: GetBurnupPerEpicQuery['gh_burnup_per_epic']
}

type Status = 'In Progress' | 'Closed' | 'Not Started'

const statusIcons = {
  'In Progress': <OpenIcon />,
  Closed: <DoneIcon />,
  'Not Started': <NotStartedIcon />,
}

export const EpicOverview = (props: Props) => {
  const { title, description, color, fullscreen, isLoading, burnup } = props

  const filteredData = burnup?.reduce(
    (
      accumulator: {
        date: string
        open_issues: number
        closed_issues: number
      }[],
      current: GetBurnupPerEpicQuery['gh_burnup_per_epic'][0]
    ) => {
      const existingItem = accumulator.find(item => item.date === current.date)
      if (!existingItem) {
        accumulator.push({
          date: current?.date,
          open_issues: current?.total_opened || 0,
          closed_issues: current?.total_closed || 0,
        })
      }

      return accumulator
    },
    []
  )

  const hasDescription = Boolean(description)

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex h-[103px] items-start justify-between">
          <div className="flex w-52 flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton width={123} height={30} />
              <Skeleton width={20} height={20} />
            </div>
            <Skeleton width={450} height={24} />
            <Skeleton width={80} height={24} />
          </div>
          <Skeleton width={335} height={30} />
        </div>
      ) : (
        <div className="h-[103px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <Text size={fullscreen ? 27 : 19} weight="semibold">
                {getEpicDisplayName(title)}
              </Text>
              {statusIcons[(props.status as Status) || 'In Progress']}
            </div>
          </div>
          {hasDescription && (
            <Text size={fullscreen ? 19 : 15} color="$neutral-50">
              {description}
            </Text>
          )}

          <div className="flex py-3">
            <Tag variant="internal" label={title} color={color} />
          </div>
        </div>
      )}

      <Chart data={filteredData || []} height={300} isLoading={isLoading} />

      {/* TODO - Add theses when we have milestones and/or labels */}
    </div>
  )
}
