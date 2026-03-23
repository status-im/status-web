import { Providers } from './_providers'

type Props = {
  children: React.ReactNode
}

export default function PortfolioLayout(props: Props) {
  const { children } = props

  return <Providers>{children}</Providers>
}
