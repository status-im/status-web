'use client'

import { useUserContext } from '~admin/_contexts/user-context'
import { checkEditPermissions } from '~admin/_utils'
import { Image, type ImageId } from '~components/assets'

import type { Segments } from '~admin/_contexts/layout-context'

type Props = {
  variant: Segments
}

type Info = {
  [key in Props['variant']]: {
    editTitle: string
    viewTitle: string
    description: string
    image: ImageId
  }
}

const INFO: Info = {
  workstreams: {
    editTitle: 'Add or edit your workstreams',
    viewTitle: 'View workstreams',
    description: 'The workstream details will appear here',
    image: 'admin/empty/workstreams:241:240',
  },
  releases: {
    editTitle: 'View or edit your releases',
    viewTitle: 'View releases',
    description: 'The release details will appear here',
    image: 'admin/empty/releases:241:240',
  },
  devices: {
    editTitle: 'Add or edit your devices',
    viewTitle: 'View devices',
    description: 'The device details will appear here',
    image: 'admin/empty/devices:241:240',
  },
  databases: {
    editTitle: 'Add or edit your databases',
    viewTitle: 'View databases',
    description: 'The database details will appear here',
    image: 'admin/empty/databases:241:240',
  },
  firmwares: {
    editTitle: 'Add or edit your firmwares',
    viewTitle: 'View firmwares',
    description: 'The firmware details will appear here',
    image: 'admin/empty/firmwares:241:240',
  },
  epics: {
    editTitle: 'Add or edit your epics',
    viewTitle: 'View epics',
    description: 'The epic details will appear here',
    image: 'admin/empty/epics:216:216',
  },
  projects: {
    editTitle: 'Add or edit your projects',
    viewTitle: 'View projects',
    description: 'The project details will appear here',
    image: 'admin/empty/projects:216:216',
  },
  reports: {
    editTitle: 'Add or edit reports',
    viewTitle: 'View reports',
    description: 'The report details will appear here',
    image: 'admin/empty/reports:240:240',
  },
}

const EmptyState = (props: Props) => {
  const { variant } = props

  const user = useUserContext()
  const canEdit = checkEditPermissions(variant, user)

  return (
    <div className="flex size-full flex-col items-center justify-center pb-12">
      <div className="z-10 flex flex-col items-center justify-center">
        <Image alt="" id={INFO[variant].image} width={80} height={80} />

        <p className="pb-[2px] pt-3 text-15 font-semibold">
          {canEdit ? INFO[variant].editTitle : INFO[variant].viewTitle}
        </p>
        <p className="text-13">{INFO[variant].description}</p>
      </div>
    </div>
  )
}

export { EmptyState }
