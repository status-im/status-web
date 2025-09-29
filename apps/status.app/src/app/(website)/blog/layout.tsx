import { Metadata } from '~app/_metadata'

import { Providers } from './_providers'

type Props = {
  children: React.ReactNode
}

export const metadata = Metadata({
  title: {
    template: '%s — Status',
    default: 'Blog',
  },
  description: 'Long form articles, thoughts, and ideas.',
})

export default function BlogLayout({ children }: Props) {
  return <Providers>{children}</Providers>
}
