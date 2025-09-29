import { api } from '~server/trpc/server'

import { SideNav } from '../_components/sidenav'

type Props = {
  children: React.ReactNode
}

export default async function ReportsLayout(props: Props) {
  const { children } = props
  const summary = await api.reports.summary()

  const links = summary.map(
    ({ name, contributorId, photoUrl, outstanding }) => ({
      name: name ?? '',
      href: `/admin/reporting/${contributorId}`,
      src: photoUrl,
      done: outstanding.length === 0,
    })
  )

  return (
    <>
      <SideNav links={links} />
      {children}
    </>
  )
}
