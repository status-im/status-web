import { getTranslations } from 'next-intl/server'

import { Metadata } from '~app/_metadata'

import { Providers } from './_providers'

import type { Metadata as NextMetadata } from 'next'

type Props = {
  children: React.ReactNode
}

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('blog')

  return Metadata({
    title: {
      template: '%s — Status',
      default: t('breadcrumb'),
    },
    description: t('description'),
  })
}

export default function BlogLayout({ children }: Props) {
  return <Providers>{children}</Providers>
}
