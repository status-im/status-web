'use client'

import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { routing } from '~/i18n/routing'

type Language = {
  value: (typeof routing.locales)[number]
  label: string
  nativeLabel: string
}

const localeCookieName = 'NEXT_LOCALE'
const localeCookieMaxAge = 60 * 60 * 24 * 365

const getLocalizedHref = (locale: (typeof routing.locales)[number]) => {
  const pathname = window.location.pathname
  const search = window.location.search
  const hash = window.location.hash
  const pathWithoutLocale = pathname.replace(/^\/(en|ko)(?=\/|$)/, '') || '/'

  const localizedPath =
    locale === routing.defaultLocale
      ? pathWithoutLocale
      : `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`

  return `${localizedPath}${search}${hash}`
}

const LanguageSelector = () => {
  const t = useTranslations('languageSelector')
  const params = useParams()
  const languages: Language[] = [
    {
      value: 'en',
      label: t('englishLabel'),
      nativeLabel: t('englishNativeLabel'),
    },
    {
      value: 'ko',
      label: t('koreanLabel'),
      nativeLabel: t('koreanNativeLabel'),
    },
  ]

  const localeParam =
    typeof params['locale'] === 'string' ? params['locale'] : undefined
  const currentLocale = languages.some(
    language => language.value === localeParam
  )
    ? localeParam
    : routing.defaultLocale

  const selectedLanguage =
    languages.find(language => language.value === currentLocale) || languages[0]

  const handleValueChange = (newLocale: string) => {
    if (newLocale === currentLocale) return

    document.cookie = `${localeCookieName}=${newLocale}; Path=/; Max-Age=${localeCookieMaxAge}; SameSite=Lax`
    window.location.replace(
      getLocalizedHref(newLocale as (typeof routing.locales)[number])
    )
  }

  return (
    <Select.Root value={currentLocale} onValueChange={handleValueChange}>
      <Select.Trigger
        className={cx([
          'bg-neutral-90',
          'flex',
          'h-full',
          'items-center',
          'gap-1',
          'rounded-10',
          'border',
          'border-neutral-30',
          'px-2',
          'py-[5px]',
          'text-15',
          'text-white-100',
          'font-medium',
          'transition-colors',
          'hover:bg-neutral-80',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-neutral-50',
          'focus:ring-offset-2',
          'focus:ring-offset-neutral-100',
          'w-[85px]',
        ])}
      >
        <div className="flex size-5 items-center justify-center rounded-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white-100"
          >
            <path
              d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.5 8H14.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 1.5C9.5 3.5 10.5 5.5 10.5 8C10.5 10.5 9.5 12.5 8 14.5C6.5 12.5 5.5 10.5 5.5 8C5.5 5.5 6.5 3.5 8 1.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <Select.Value placeholder={selectedLanguage.value.toUpperCase()}>
          <span className="flex text-15 font-medium text-white-100">
            {selectedLanguage.value.toUpperCase()}
          </span>
        </Select.Value>

        <Select.Icon asChild>
          <ChevronDownIcon className="size-5 text-white-100" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={cx([
            'z-[200]',
            'min-w-[246px]',
            'rounded-16',
            'border',
            'border-neutral-20',
            'bg-white-100',
            'p-4',
            'shadow-2',
          ])}
          position="popper"
          sideOffset={8}
        >
          <Select.Viewport>
            {languages.map(language => (
              <Select.Item
                key={language.value}
                value={language.value}
                className={cx([
                  'flex',
                  'cursor-pointer',
                  'items-center',
                  'justify-between',
                  'rounded-8',
                  'p-2',
                  'transition-colors',
                  'hover:bg-neutral-10',
                  'focus:bg-neutral-10',
                  'focus:outline-none',
                  'data-[state=checked]:bg-neutral-10',
                ])}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="text-13 font-medium text-neutral-100">
                    {language.label}
                  </div>
                  <div className="text-13 font-medium text-neutral-50">
                    {language.nativeLabel}
                  </div>
                </div>

                <Select.ItemIndicator>
                  <CheckIcon className="size-5 text-neutral-100" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export { LanguageSelector }
