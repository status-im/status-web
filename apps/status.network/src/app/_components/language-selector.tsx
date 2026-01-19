'use client'

import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon } from '@status-im/icons/20'
import { usePathname, useRouter } from '~/i18n/navigation'
import { cx } from 'cva'
import { useParams } from 'next/navigation'
import { routing } from '../../i18n/routing'

const languages = [
  {
    value: 'en',
    label: 'English (EN)',
    nativeLabel: 'English',
  },
  {
    value: 'ko',
    label: 'Korean (KO)',
    nativeLabel: '한국어',
  },
]

export const LanguageSelector = () => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = (params['locale'] as string) || routing.defaultLocale

  const selectedLanguage =
    languages.find(lang => lang.value === currentLocale) || languages[0]

  const handleValueChange = (newLocale: string) => {
    // Use next-intl's router with locale option for proper locale switching
    router.replace(pathname, { locale: newLocale as 'en' | 'ko' })
  }

  return (
    <Select.Root value={currentLocale} onValueChange={handleValueChange}>
      <Select.Trigger
        className={cx([
          'bg-neutral-90',
          'flex',
          'items-center',
          'gap-1',
          'px-2',
          'py-[5px]',
          'rounded-10',
          'text-15',
          'font-medium',
          'hover:bg-neutral-80',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-neutral-50',
          'focus:ring-offset-2',
          'focus:ring-offset-neutral-100',
          'transition-colors',
          'w-[85px]',
          'h-full',
          'border-neutral-30',
          'border',
        ])}
      >
        {/* Globe icon */}
        <div className="rounded-4 flex size-5 items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-neutral-40"
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
          <span className="font-medium flex text-15 text-neutral-100">
            {selectedLanguage.value.toUpperCase()}
          </span>
        </Select.Value>

        <Select.Icon asChild>
          <ChevronDownIcon className="size-5" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={cx([
            'bg-white-100',
            'rounded-16',
            'p-4',
            'shadow-2',
            'min-w-[246px]',
            'z-[200]',
            'border',
            'border-neutral-20',
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
                  'items-center',
                  'justify-between',
                  'p-2',
                  'rounded-8',
                  'cursor-pointer',
                  'hover:bg-neutral-10',
                  'focus:bg-neutral-10',
                  'focus:outline-none',
                  'data-[state=checked]:bg-neutral-10',
                  'transition-colors',
                ])}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="font-medium text-13 text-neutral-100">
                    {language.label}
                  </div>
                  <div className="font-medium text-13 text-neutral-50">
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
