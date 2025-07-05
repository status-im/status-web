import { CheckIcon, NegativeStateIcon, PendingIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { match } from 'ts-pattern'

import type { Activity } from '@status-im/wallet/data'

type ActivityStatusProps = {
  status: Activity['status']
}

const ActivityStatus = (props: ActivityStatusProps) => {
  const { status } = props

  const baseClass =
    'flex items-center gap-1 rounded-20 border pl-[5px] pr-[8px] py-[3px] h-6'

  return match(status)
    .with('success', () => {
      return (
        <div className={cx(baseClass, 'border-success-50 bg-success-50/10')}>
          <CheckIcon className="text-success-50" />
          <div className="text-13 font-500 text-success-50">Success</div>
        </div>
      )
    })
    .with('failed', () => {
      return (
        <div className={cx(baseClass, 'border-danger-50/20 bg-danger-50/10')}>
          <NegativeStateIcon className="text-danger-50" />
          <div className="text-13 font-500 text-danger-50">Failed</div>
        </div>
      )
    })
    .with('pending', () => {
      return (
        <div className={cx(baseClass, 'border-neutral-20 bg-neutral-10')}>
          <PendingIcon className="text-neutral-40" />
          <div className="flex text-13 font-400 text-neutral-40">Pending</div>
        </div>
      )
    })
    .with('unknown', () => {
      return (
        <div className={cx(baseClass, 'border-neutral-20 bg-neutral-10')}>
          <div className="flex text-13 font-400 text-neutral-50">Unknown</div>
        </div>
      )
    })
    .exhaustive()
}

export { ActivityStatus }
