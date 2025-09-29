import {
  BrowserIcon,
  CommunitiesIcon,
  MessengerIcon,
  NodeIcon,
  ShellIcon,
  WalletIcon,
} from '@status-im/icons/20'
import { match } from 'ts-pattern'

import type { ApiOutput } from '~server/api/types'

type Props = {
  type: ApiOutput['projects']['byId']['app']
}

export const InsightsAppIcon = (props: Props) => {
  const { type } = props

  return match(type)
    .with('shell', () => <ShellIcon className="text-[#1992D7]" />)
    .with('communities', () => <CommunitiesIcon className="text-[#2A799B]" />)
    .with('messenger', () => <MessengerIcon className="text-[#7140FD]" />)
    .with('wallet', () => <WalletIcon className="text-[#F6B03C]" />)
    .with('browser', () => <BrowserIcon className="text-[#EC266C]" />)
    .with('node', () => <NodeIcon className="text-[#CB6256]" />)
    .exhaustive()
}
