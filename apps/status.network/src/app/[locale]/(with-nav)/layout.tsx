import { SiteShell } from '~app/_components/site-shell'
import { setRequestLocale } from 'next-intl/server'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function WithNavLayout({ children, params }: Props) {
  const { locale } = await params

  setRequestLocale(locale)

  return <SiteShell>{children}</SiteShell>
}
