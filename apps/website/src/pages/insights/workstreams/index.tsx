import { IconButton, Shadow, Tag, Text } from '@status-im/components'
import {
  DoneIcon,
  NotStartedIcon,
  OpenIcon,
  SearchIcon,
  SortIcon,
} from '@status-im/icons'

import { EpicOverview } from '@/components/epic-overview'
import { InsightsLayout } from '@/layouts/insights-layout'

import type { Page } from 'next'

const workstreams = [
  {
    id: 1,
    title: 'Workstream protocol',
    description: 'Support Encrypted Communities',
  },
  {
    id: 5155,
    title: 'Work with keys',
    description:
      'Detecting keycard reader removal for the beginning of each flow',
  },
]

const WorkstreamsPage: Page = () => {
  return (
    <div className="space-y-4 p-10">
      <Text size={27} weight="semibold">
        Workstreams
      </Text>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Tag size={32} label="In Progress" icon={OpenIcon} selected />
          <Tag size={32} label="Closed" icon={DoneIcon} />
          <Tag size={32} label="Not Started" icon={NotStartedIcon} />
        </div>

        <div className="flex gap-2">
          <IconButton variant="outline" icon={<SearchIcon size={20} />} />
          <IconButton variant="outline" icon={<SortIcon size={20} />} />
        </div>
      </div>

      <div className="grid gap-4">
        {workstreams.map(workstream => (
          <Shadow
            key={workstream.id}
            variant="$2"
            className="rounded-2xl px-4 py-3"
          >
            <EpicOverview
              title={workstream.title}
              description={workstream.description}
            />
          </Shadow>
        ))}
      </div>
    </div>
  )
}

WorkstreamsPage.getLayout = InsightsLayout

export default WorkstreamsPage
