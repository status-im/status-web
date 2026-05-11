import { Metadata } from '~app/_metadata'

export async function generateMetadata() {
  return Metadata({
    title: 'Status',
    alternates: {
      canonical: '/insights/epics',
    },
  })
}

type Props = {
  children: React.ReactNode
}

export default function EpicsLayout({ children }: Props) {
  return children
}
