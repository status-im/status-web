'use client'

import { StatusProvider } from '@status-im/components'

// import { Link } from '../_components/link'

// const config = {
//   link: Link,
// }

type Props = {
  children: React.ReactNode
}

const _StatusProvider = ({ children }: Props) => {
  return (
    <StatusProvider
      config={{
        link: () => null,
      }}
      // config={config}
    >
      {children}
    </StatusProvider>
  )
}

export { _StatusProvider as StatusProvider }
