import { ButtonLink } from '~app/_components/button-link'
import { Divider } from '~app/_components/divider'
import { Link } from '~components/link'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export async function BlogHeader() {
  const t = await getTranslations()
  return (
    <header className="sticky top-0 z-[60] w-full bg-white-90 backdrop-blur supports-[backdrop-filter]:bg-white-80">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Status Network Logo"
            width={210}
            height={32}
          />
        </Link>
        <div className="flex items-center gap-3">
          <ButtonLink
            href="/"
            variant="white"
            size="32"
            className="hidden sm:block"
          >
            {t('blog.home')}
          </ButtonLink>
          <ButtonLink href="https://hub.status.network/" size="32">
            {t('blog.get_started')}
          </ButtonLink>
        </div>
      </div>
      <Divider />
    </header>
  )
}
