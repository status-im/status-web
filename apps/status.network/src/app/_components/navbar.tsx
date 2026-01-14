'use client'

import { getLocalizedRoutes } from '~/config/routes'
import { Link } from '~/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { ButtonLink } from './button-link'
import { Divider } from './divider'
import { LanguageSelector } from './language-selector'

const NavBar = () => {
  const t = useTranslations()
  const locale = useLocale()
  const localizedRoutes = getLocalizedRoutes(t, locale)

  return (
    <header className="sticky top-0 z-[60] hidden w-full bg-white-90 backdrop-blur supports-[backdrop-filter]:bg-white-80 lg:block">
      <nav className="mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Status Network Logo"
            width={210}
            height={32}
          />
        </Link>
        <div className="hidden items-center space-x-6 md:flex">
          {localizedRoutes.Navigation.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="text-15 font-500 text-neutral-100 transition-colors hover:text-neutral-80/60"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <ButtonLink
            href={localizedRoutes.Docs}
            variant="white"
            size="32"
            className="hidden sm:block"
          >
            {t('common.read_docs')}
          </ButtonLink>
          <ButtonLink href={localizedRoutes.Hub} size="32">
            {t('common.get_started')}
          </ButtonLink>
          <LanguageSelector />
        </div>
      </nav>
      <Divider />
    </header>
  )
}

export { NavBar }
