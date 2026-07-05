import { ButtonLink } from '~app/_components/button-link'
import { SiteShell } from '~app/_components/site-shell'
import { Metadata } from '~app/_metadata'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const metadata = Metadata({
  title: '404 — Page Not Found',
  description:
    'The page you were looking for could not be found. Return to the Status Network homepage.',
  robots: {
    index: false,
  },
})

type Props = {
  params: Promise<{ locale: string }>
}

export default async function NotFound({ params }: Props) {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations('not_found')

  return (
    <SiteShell>
      <main className="flex min-h-[calc(100dvh-189px)] flex-1 items-center justify-center px-5 lg:min-h-[calc(100dvh-118px)]">
        <div className="flex max-w-[696px] flex-col items-center gap-8">
          <h1 className="text-center text-40 font-700 lg:text-64">
            {t('title')}
          </h1>

          <ButtonLink href="/">{t('take_me_home')}</ButtonLink>
        </div>
      </main>
    </SiteShell>
  )
}
