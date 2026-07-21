'use client'

import { SOCIALS } from '@status-im/status-network/config'
import NextImage from 'next/image'
import { useTranslations } from 'next-intl'

import { Link } from '~/i18n/navigation'

import { BRAND, LEGAL } from '../../config/routes'

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="relative z-[61]">
      <div className="grid justify-start gap-4 p-3 lg:grid-cols-[1fr,auto,auto] lg:gap-0 lg:p-4">
        <div className="flex flex-col justify-center gap-2 lg:flex-row lg:justify-start lg:gap-3">
          <span className="text-left text-13">
            &copy; Status Research & Development GmbH
          </span>
          <Dot className="hidden text-neutral-50 lg:block" />
        </div>

        <div className="flex flex-col items-start justify-center gap-3 lg:flex-row lg:items-center lg:justify-end">
          <div className="flex items-start justify-center gap-4 md:gap-3 lg:items-center lg:justify-end">
            <Link
              href={LEGAL.termsOfUse.href}
              className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
            >
              {t('footer.terms_of_use')}
            </Link>
            <Link
              href={LEGAL.privacyPolicy.href}
              className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
            >
              {t('footer.privacy_policy')}
            </Link>
            <Link
              href={BRAND.href}
              className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
            >
              {t('footer.brand_assets')}
            </Link>
            <Link
              href={LEGAL.preDepositDisclaimer.href}
              className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
            >
              {t('footer.pre_deposit_disclaimer')}
            </Link>
          </div>
          <Dot className="2md:hidden text-neutral-50" />
          <div className="flex justify-start gap-6 lg:justify-end">
            {Object.values(SOCIALS).map(social => (
              <a
                href={social.href}
                key={social.name}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-[60%]"
              >
                <NextImage
                  src={social.src}
                  alt={social.name}
                  width={20}
                  height={20}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
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
    <circle cx="1" cy="1" r="1" fill="#A1ABBD" />
  </svg>
)
