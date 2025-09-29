import * as Tooltip from '@radix-ui/react-tooltip'
import { InfoIcon, WarningIcon } from '@status-im/icons/16'
import { TimeOffIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { InsightsAppIcon } from '~admin/insights/_components/insights-app-icon'

import type { ModifiedMilestone, ReportsFormValues } from './reports-form'
import type { ApiOutput } from '~server/api/types'

type Props = {
  milestones: ModifiedMilestone[]
  values: ReportsFormValues
  allocation: number
}

const appColors = {
  shell: 'bg-customisation-sky-50 hover:bg-customisation-sky-60',
  communities:
    'bg-customisation-turquoise-50 hover:bg-customisation-turquoise-60',
  messenger: 'bg-customisation-purple-50 hover:bg-customisation-purple-60',
  wallet: 'bg-customisation-yellow-50 hover:bg-customisation-yellow-60',
  browser: 'bg-customisation-magenta-50 hover:bg-customisation-magenta-60',
  node: 'bg-customisation-copper-50 hover:bg-customisation-copper-60',
  timeOff: 'bg-neutral-40 hover:bg-neutral-50',
}

const TimeSummary = (props: Props) => {
  const { milestones, values, allocation } = props

  const bars = milestones.map(milestone => {
    const timeSpent =
      values.milestones.find(value => value.id === milestone.id)?.timeSpent ?? 0

    return {
      ...milestone,
      timeSpent,
    }
  })

  const timeOffBar = {
    name: 'Member has been OOO',
    projectName: 'Time Off',
    app: 'timeOff' as TooltipSummaryProps['app'],
    timeSpent: values.timeOff,
  }

  return (
    <div className="flex flex-col rounded-16 border border-neutral-10 p-3 text-13">
      <span className="text-15 font-semibold text-neutral-100">
        Time Summary
      </span>
      <span className="text-neutral-50">Where member spent their time</span>
      <div className="my-3 flex h-2 w-full gap-px overflow-hidden rounded-8 bg-neutral-20 bg-gradient-hatching">
        {[...bars, timeOffBar].map(bar => {
          return (
            <TooltipSummary {...bar} key={bar.projectName + bar.name}>
              <div
                className={cx('h-2', appColors[bar.app])}
                style={{
                  width: `${bar.timeSpent}%`,
                }}
              />
            </TooltipSummary>
          )
        })}
      </div>
      {allocation <= 100 && (
        <div className="flex items-center justify-center gap-2 rounded-12 border border-neutral-20 bg-neutral-5 px-4 py-3">
          <InfoIcon className="text-neutral-50" /> {100 - allocation}% of time
          remaining to allocate
        </div>
      )}

      {allocation > 100 && (
        <div className="flex items-center justify-center gap-2 rounded-12 border border-danger-50/10 bg-danger-50/5 px-4 py-3 text-danger-50">
          <WarningIcon className="text-danger-50" /> You&apos;re{' '}
          {allocation - 100}% over 100%, this doesn&apos;t make sense 😅
        </div>
      )}
    </div>
  )
}

type TooltipSummaryProps = {
  name: string
  projectName: string
  app: ApiOutput['projects']['byId']['app'] | 'timeOff'
  timeSpent: number
  children: React.ReactNode
}

const TooltipSummary = (props: TooltipSummaryProps) => {
  const { name, projectName, app, timeSpent, children } = props

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="relative select-none rounded-16 border border-neutral-10 bg-white-100 shadow-1 will-change-[transform,opacity] data-[state=delayed-open]:animate-in"
            side="top"
            align="center"
            sideOffset={10}
          >
            <div className="flex">
              <div className="flex flex-col px-4 py-3">
                <span className="text-15 font-semibold text-neutral-100">
                  {name}
                </span>
                <span className="flex items-center gap-1 text-13 font-medium text-neutral-100">
                  {app === 'timeOff' ? (
                    <TimeOffIcon className="text-neutral-50" />
                  ) : (
                    <InsightsAppIcon type={app} />
                  )}
                  {projectName}
                </span>
              </div>
              <div className="flex items-center justify-center border-l border-neutral-10 px-4 py-3 text-15 font-semibold">
                {timeSpent}%
              </div>
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export { TimeSummary }
