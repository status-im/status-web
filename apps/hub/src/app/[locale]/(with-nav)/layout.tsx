import { setRequestLocale } from 'next-intl/server'

import { HubLayout } from '~components/hub-layout'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function WithNavLayout({ children, params }: Props) {
  const { locale } = await params

  setRequestLocale(locale)

  return <HubLayout>{children}</HubLayout>
}
