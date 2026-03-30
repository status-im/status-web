import NextImage from 'next/image'
import { getTranslations } from 'next-intl/server'

import { LEGAL, MESSARI_URL, ROUTES, SECURITY, SOCIALS } from '~/config/routes'
import { Link } from '~components/link'
import { Logo } from '~components/logo'

import { AccordionMenu } from '../navigation/accordion-menu'
import { Section } from './section'

export const Footer = async () => {
  const t = await getTranslations('footer')
  const tn = await getTranslations('nav')
  return (
    <footer>
      {/* MENU DESKTOP */}
      <div className="hidden grid-cols-4 divide-x divide-dashed divide-neutral-80 pb-6 lg:grid 2xl:grid-cols-8">
        <div className="flex items-start border-t border-dashed border-neutral-80 p-6 pr-0">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {Object.entries(ROUTES).map(([titleKey, links]) => (
          <Section key={titleKey} title={tn(titleKey)} routes={links} />
        ))}
      </div>
      {/* MENU MOBILE */}
      <div className="flex flex-col border-b border-dashed border-neutral-80 px-5 pb-8 pt-6 lg:hidden">
        <Link href="/" className="mb-6">
          <Logo />
        </Link>
        <AccordionMenu />
      </div>
      {/* FOOTER LINKS */}
      <div className="grid gap-5 px-6 pb-12 pt-6 lg:grid-cols-[1fr,auto,auto] lg:pb-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
          <span className="text-13 text-neutral-50">{t('copyright')}</span>
          <Dot className="hidden text-neutral-50 lg:block" />
          <div className="flex items-center gap-2 2md:gap-3">
            <Link
              href={LEGAL.termsOfUse.href}
              className="text-13 text-neutral-40 transition-colors hover:text-neutral-50"
            >
              {tn(LEGAL.termsOfUse.nameKey)}
            </Link>
            <Dot className="text-neutral-50 2md:hidden" />
            <Link
              href={LEGAL.privacyPolicy.href}
              className="text-13 text-neutral-40 transition-colors hover:text-neutral-50"
            >
              {tn(LEGAL.privacyPolicy.nameKey)}
            </Link>
            <Link
              href={SECURITY.href}
              className="text-13 text-neutral-40 transition-colors hover:text-neutral-50"
            >
              {tn(SECURITY.nameKey)}
            </Link>
          </div>
        </div>

        <Link
          href={MESSARI_URL}
          className="flex items-center gap-3 text-neutral-50 transition-colors hover:text-neutral-30"
        >
          <MessariLogo />
          <span className="text-13">{t('messari')}</span>
        </Link>

        <div className="flex gap-6 lg:gap-3">
          {Object.values(SOCIALS).map(social => {
            return (
              <Link
                href={social.href}
                key={social.nameKey}
                className="transition-opacity hover:opacity-[60%]"
              >
                <NextImage
                  src={social.src}
                  alt={tn(social.nameKey)}
                  width={20}
                  height={20}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </footer>
  )
}

const MessariLogo = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2650_62112)">
        <path
          d="M11.9531 4.24242L16.0019 0V12.2667L11.9531 15.9515V4.24242Z"
          fill="currentColor"
        />
        <path
          d="M5.97656 6.37524L7.92778 7.97523L10.0253 6.13281V12.2661L5.97656 15.951V6.37524Z"
          fill="currentColor"
        />
        <path
          d="M4.07317 4.24242L0 0V16L4.07317 12.5576V4.24242Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2650_62112">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

const Dot = (props: React.ComponentProps<'svg'>) => (
  <svg
    width="2"
    height="2"
    viewBox="0 0 2 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="1" cy="1" r="1" fill="#647084" />
  </svg>
)
