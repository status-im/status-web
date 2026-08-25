import { CanonicalMetadata } from '~app/_metadata'

export const metadata = CanonicalMetadata('/insights/orphans')

type Props = {
  children: React.ReactNode
}

export default function OrphansLayout({ children }: Props) {
  return children
}
