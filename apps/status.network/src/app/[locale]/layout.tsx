import { getPathname } from '@status-im/status-network/utils'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Metadata } from '../_metadata'

export async function generateMetadata() {
  const pathname = await getPathname()

  return Metadata({
    title: '',
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
      {children}
    </NextIntlClientProvider>
  )
}
