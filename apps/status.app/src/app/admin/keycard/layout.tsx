import {
  DatabasesIcon,
  FirmwareIcon,
  KeyboardIcon,
  KeycardCardIcon,
} from '@status-im/icons/20'

import { SideNav } from '../_components/sidenav'

type Props = {
  children: React.ReactNode
}

export default function KeycardLayout({ children }: Props) {
  return (
    <>
      <SideNav
        links={[
          {
            name: 'Keycard',
            href: '/admin/keycard/overview',
            icon: <KeyboardIcon />,
          },
          {
            name: 'Devices',
            href: '/admin/keycard/devices',
            icon: <KeycardCardIcon />,
          },
          {
            name: 'Databases',
            href: '/admin/keycard/databases',
            icon: <DatabasesIcon />,
          },
          {
            name: 'Firmwares',
            href: '/admin/keycard/firmwares',
            icon: <FirmwareIcon />,
          },
        ]}
      />
      {children}
    </>
  )
}
