import {
  EpicsIcon,
  FlagIcon,
  FolderIcon,
  WorkstreamsIcon,
} from '@status-im/icons/20'

import { SideNav } from '../_components/sidenav'

type Props = {
  children: React.ReactNode
}

export default function InsightsLayout({ children }: Props) {
  return (
    <>
      <SideNav
        links={[
          {
            name: 'Workstreams',
            href: '/admin/insights/workstreams',
            icon: <WorkstreamsIcon />,
          },
          {
            name: 'Projects',
            href: '/admin/insights/projects',
            icon: <FolderIcon />,
          },
          {
            name: 'Epics',
            href: '/admin/insights/epics',
            icon: <EpicsIcon />,
          },
          {
            name: 'Releases',
            href: '/admin/insights/releases',
            icon: <FlagIcon />,
          },
        ]}
      />
      {children}
    </>
  )
}
