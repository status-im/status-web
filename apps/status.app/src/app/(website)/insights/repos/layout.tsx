import { CanonicalMetadata } from '~app/_metadata'

export const metadata = CanonicalMetadata('/insights/repos')

type Props = {
  children: React.ReactNode
}

export default function ReposLayout({ children }: Props) {
  return children
}
