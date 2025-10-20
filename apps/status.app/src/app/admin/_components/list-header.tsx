'use client'

import { useUserContext } from '~admin/_contexts/user-context'
import { checkEditPermissions } from '~admin/_utils'

import type { Segments } from '~admin/_contexts/layout-context'

type Props = {
  variant: Segments
  children?: React.ReactNode
}

const DATA = {
  workstreams: {
    title: 'Workstreams',
    description: 'Add, view, and manage workstreams',
  },
  releases: {
    title: 'Releases',
    description: 'View, and manage releases',
  },
  devices: {
    title: 'Devices',
    description: 'Add, view, and manage devices',
  },
  databases: {
    title: 'Databases',
    description: 'Add, view, and manage databases',
  },
  firmwares: {
    title: 'Firmwares',
    description: 'Add, view, and manage firmwares',
  },
  epics: {
    title: 'Epics',
    description: 'Add, view, and manage epics',
  },
  projects: {
    title: 'Projects',
    description: 'Add, view, and manage projects',
  },
  reports: {
    title: 'Reports',
    description: '',
  },
} satisfies Record<Props['variant'], { title: string; description: string }>

const ListHeader = (props: Props) => {
  const { variant, children } = props

  const user = useUserContext()
  const canEdit = checkEditPermissions(variant, user)

  return (
    <div className="mb-4 flex flex-row justify-between">
      <div>
        <h1 className="mb-1 text-27 font-semibold">{DATA[variant].title}</h1>
        {canEdit && DATA[variant].description && (
          <p className="text-13 md:text-15">{DATA[variant].description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

export { ListHeader }
