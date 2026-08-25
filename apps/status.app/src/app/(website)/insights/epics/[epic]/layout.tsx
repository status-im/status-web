import { CanonicalMetadata } from '~app/_metadata'

type Props = {
  children: React.ReactNode
  params: Promise<{ epic: string }>
}

export async function generateMetadata({ params }: Pick<Props, 'params'>) {
  const { epic } = await params

  return CanonicalMetadata(`/insights/epics/${epic}`)
}

export default function EpicLayout({ children }: Props) {
  return children
}
