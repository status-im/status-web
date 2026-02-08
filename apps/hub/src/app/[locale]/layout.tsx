import { getPathname } from '@status-im/status-network/utils'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import { Metadata as MetadataFn } from '../_metadata'
import { Providers } from '../_providers'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const pathname = await getPathname()

  if (pathname === '/') {
    return MetadataFn({
      title: 'Status Network | Gasless Ethereum Layer 2 with Privacy',
      description:
        'Explore Status Network, a gasless Ethereum Layer 2 with a native privacy layer, shared yield, staking, and reputation-based governance.',
      pathname,
      locale,
    })
  }

  return MetadataFn({
    pathname,
    locale,
  })
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  )
}
