'use client'

import { StatusProvider } from '@status-im/components'

import { Link } from '~components/link'

const config = {
  link: Link,
}

type Props = {
  children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  return <StatusProvider config={config}>{children}</StatusProvider>
}
