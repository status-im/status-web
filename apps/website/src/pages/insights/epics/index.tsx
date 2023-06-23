import { useState } from 'react'

import { IconButton, Shadow, Tag, Text } from '@status-im/components'
import {
  DoneIcon,
  NotStartedIcon,
  OpenIcon,
  SearchIcon,
  SortIcon,
} from '@status-im/icons'

import { DatePicker } from '@/components/datepicker/datepicker'
import { EpicOverview } from '@/components/epic-overview'
import { InsightsLayout } from '@/layouts/insights-layout'

import type { DateRange } from '@status-im/components/src/calendar/calendar'
import type { Page } from 'next'

export const epics = [
  {
    id: '1',
    title: 'Communities protocol',
    description: 'Support Encrypted Communities',
  },
  {
    id: '5155',
    title: 'Keycard',
    description:
      'Detecting keycard reader removal for the beginning of each flow',
  },
]

const EpicsPage: Page = () => {
  const [selectedDates, setSelectedDates] = useState<DateRange>()

  return (
    <div className="space-y-4 p-10">
      <Text size={27} weight="semibold">
        Epics
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
        {epics.map(epic => (
          <Shadow key={epic.id} variant="$2" className="rounded-2xl px-4 py-3">
            <EpicOverview title={epic.title} description={epic.description} />
          </Shadow>
        ))}
      </div>
      <DatePicker selected={selectedDates} onSelect={setSelectedDates} />
    </div>
  )
}

EpicsPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export default EpicsPage
