import { api } from '~server/trpc/server'

import { DynamicLayout } from '../../_components/dynamic-layout'
import { ReleasesList } from './_components/releases-list'

export const dynamic = 'force-dynamic'

type Props = {
  children: React.ReactNode
}

export default async function ReleasesLayout(props: Props) {
  const { children } = props

  const releases = await api.releases.all()

  return (
    <DynamicLayout
      leftView={<ReleasesList releases={releases} />}
      rightView={children}
    />
  )
}
