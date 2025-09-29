import { match } from 'ts-pattern'

import { InsightsStatusIcon } from './insights-status-icon'

type Props = {
  children: React.ReactNode
}

export const StatusGroupList = (props: Props) => {
  const { children } = props

  return <div className="flex flex-col gap-6">{children}</div>
}

type StatusGroupItemProps = {
  status: 'done' | 'in-progress' | 'not-started' | 'paused'
  children: React.ReactNode
}

const StatusGroupItem = (props: StatusGroupItemProps) => {
  const { status, children } = props

  const { title, textColor } = match(status)
    .with('not-started', () => ({
      title: 'Not started',
      textColor: 'text-neutral-100',
    }))
    .with('in-progress', () => ({
      title: 'In progress',
      textColor: 'text-customisation-orange-50',
    }))
    .with('done', () => ({
      title: 'Done',
      textColor: 'text-success-50',
    }))
    .with('paused', () => ({
      title: 'Paused',
      textColor: 'text-neutral-100',
    }))
    .exhaustive()

  return (
    <div>
      <div className="mb-3 flex items-center gap-1">
        <InsightsStatusIcon status={status} />
        <span className={`text-13 font-medium ${textColor}`}>{title}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

StatusGroupList.Item = StatusGroupItem
