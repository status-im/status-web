import { api } from '~server/trpc/server'

import { DynamicLayout } from '../../_components/dynamic-layout'
import { EpicsList } from './_components/epics-list'

export const dynamic = 'force-dynamic'

type Props = {
  children: React.ReactNode
}

export default async function EpicsLayout(props: Props) {
  const { children } = props

  const epics = await api.epics.all()

  return (
    <DynamicLayout
      leftView={<EpicsList epics={epics} />}
      rightView={children}
    />
  )
}
