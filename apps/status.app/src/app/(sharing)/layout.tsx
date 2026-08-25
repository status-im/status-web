import { Providers } from './_providers'

import type { Metadata } from 'next'

// Deep links into the app that render user-supplied community and profile
// data. `robots.txt` already keeps crawlers out; this states the same thing in
// the HTML, so these routes need no canonical of their own.
export const metadata: Metadata = {
  robots: { index: false },
}

type Props = {
  children: React.ReactNode
}

export default function PortfolioLayout(props: Props) {
  const { children } = props

  return <Providers>{children}</Providers>
}
