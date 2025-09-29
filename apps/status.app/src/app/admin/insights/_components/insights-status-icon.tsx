import {
  DoneIcon,
  NotStartedIcon,
  OpenIcon,
  PauseIcon,
} from '@status-im/icons/20'
import { match } from 'ts-pattern'

type Props = {
  status: 'not-started' | 'in-progress' | 'done' | 'paused'
}

export const InsightsStatusIcon = (props: Props) => {
  const { status } = props

  return match(status)
    .with('not-started', () => <NotStartedIcon className="text-neutral-50" />)
    .with('in-progress', () => (
      <OpenIcon className="text-customisation-orange-50" />
    ))
    .with('done', () => <DoneIcon className="text-success-50" />)
    .with('paused', () => <PauseIcon className="text-neutral-50" />)
    .exhaustive()
}
