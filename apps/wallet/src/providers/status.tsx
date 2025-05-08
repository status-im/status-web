import { StatusProvider } from '@status-im/components'
import { Link } from '@tanstack/react-router'

type Props = {
  children: React.ReactNode
}

function _StatusProvider(props: Props) {
  const { children } = props

  return <StatusProvider config={{ link: Link }}>{children}</StatusProvider>
}

export { _StatusProvider as StatusProvider }
