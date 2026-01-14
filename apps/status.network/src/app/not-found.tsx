import { getTranslations } from 'next-intl/server'
import { ButtonLink } from './_components/button-link'
import { Metadata } from './_metadata'

export const metadata = Metadata({
  title: '404 — Page Not Found',
  description:
    'The page you were looking for could not be found. Return to the Status Network homepage.',
  robots: {
    index: false,
  },
})

export default async function NotFound() {
  const t = await getTranslations()

  return (
    <main className="flex min-h-[calc(100dvh-189px)] flex-1 items-center justify-center px-5 lg:min-h-[calc(100dvh-118px)]">
      <div className="flex max-w-[696px] flex-col items-center gap-8">
        <h1 className="text-center text-40 font-700 lg:text-64">
          {t('not_found.title.translation')}
        </h1>

        <ButtonLink href="/">
          {t('not_found.take_me_home.translation')}
        </ButtonLink>
      </div>
    </main>
  )
}
