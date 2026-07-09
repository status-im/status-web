import { setRequestLocale } from 'next-intl/server'

import { HubLayout } from '~components/hub-layout'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function TopNavLayout({ children, params }: Props) {
  const { locale } = await params

  setRequestLocale(locale)

  return <HubLayout showSidebar={false}>{children}</HubLayout>
}
