import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import { Metadata as MetadataFn } from '../_metadata'
import { Providers } from '../_providers'
import { getPathname } from '../_utils/get-pathname'

export async function generateMetadata() {
  const pathname = await getPathname()

  return MetadataFn({
    pathname,
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
