import { useTranslations } from 'next-intl'
import { match } from 'ts-pattern'

import { getAdminStatusLabel } from '../_utils/i18n'
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
  const t = useTranslations('admin')

  const { textColor } = match(status)
    .with('not-started', () => ({
      textColor: 'text-neutral-100',
    }))
    .with('in-progress', () => ({
      textColor: 'text-customisation-orange-50',
    }))
    .with('done', () => ({
      textColor: 'text-success-50',
    }))
    .with('paused', () => ({
      textColor: 'text-neutral-100',
    }))
    .exhaustive()

  return (
    <div>
      <div className="mb-3 flex items-center gap-1">
        <InsightsStatusIcon status={status} />
        <span className={`text-13 font-medium ${textColor}`}>
          {getAdminStatusLabel(t, status)}
        </span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

StatusGroupList.Item = StatusGroupItem
