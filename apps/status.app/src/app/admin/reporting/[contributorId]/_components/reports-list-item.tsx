import { Button, Tag } from '@status-im/components'
import { MilestonesIcon, TimeOffIcon } from '@status-im/icons/12'
import { EditIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { pluralize } from '~admin/_utils'
import { Link } from '~components/link'

import { ReportsDateHeader } from './reports-date-header'

import type { ApiOutput } from '~server/api/types'

type Props = React.ComponentProps<'li'> & {
  startOfWeek: Date
  isDone?: boolean
  disabled?: boolean
  href: string
  milestones?: ApiOutput['projects']['all'][number]['milestones']
  timeOff?: boolean
}

const ReportsListItem = (props: Props) => {
  const {
    startOfWeek,
    href,
    isDone = false,
    disabled = false,
    milestones = [],
    timeOff = false,
    ...rest
  } = props

  return (
    <li
      {...rest}
      className={cx(
        'flex select-none flex-col rounded-16 border border-solid border-neutral-10',
        'hover:border-neutral-10 hover:bg-neutral-5',
        'aria-selected:border-customisation-blue-50/20 aria-selected:bg-customisation-blue-50/5'
      )}
    >
      <Link href={href}>
        <div className="flex flex-col px-4 py-3">
          <div className="flex items-center justify-between">
            <ReportsDateHeader size={13} startOfWeek={startOfWeek} />
            {isDone ? (
              <Button
                variant="outline"
                size="24"
                icon={<EditIcon />}
                aria-label="Edit report"
                disabled={disabled}
              />
            ) : (
              <Button variant="outline" size="24" disabled={disabled}>
                Add
              </Button>
            )}
          </div>

          {isDone && (
            <div className="flex gap-1 pt-1">
              {milestones.length > 0 && (
                <Tag
                  size="24"
                  label={pluralize(milestones.length, 'milestone')}
                  icon={<MilestonesIcon />}
                />
              )}

              {timeOff ? (
                <Tag size="24" label="Time off" icon={<TimeOffIcon />} />
              ) : null}
            </div>
          )}
        </div>
      </Link>
    </li>
  )
}

export { ReportsListItem }
