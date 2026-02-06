'use client'

import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon } from '@status-im/icons/20'
import { cva, cx } from 'cva'
import { useParams, useRouter as useNextRouter } from 'next/navigation'

import { usePathname, useRouter } from '~/i18n/navigation'

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

const sizeStyles = cva({
  base: 'flex items-center justify-center',
  variants: {
    size: {
      '24': 'size-4',
      '32': 'size-5',
    },
  },
})

type Props = {
  size: '24' | '32'
}

export const LanguageSelector = (props: Props) => {
  const { size } = props

  const router = useRouter()
  const nextRouter = useNextRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = (params['locale'] as string) || routing.defaultLocale

  const selectedLanguage =
    languages.find(lang => lang.value === currentLocale) || languages[0]

  const handleValueChange = (newLocale: string) => {
    if (newLocale === routing.defaultLocale) {
      // For default locale (en), navigate without prefix
      nextRouter.replace(pathname)
    } else {
      // For other locales, use next-intl's router to add prefix
      router.replace(pathname, { locale: newLocale as 'en' | 'ko' })
    }
  }

  return (
    <Select.Root value={currentLocale} onValueChange={handleValueChange}>
      <Select.Trigger
        className={cx([
          'flex',
          'cursor-pointer',
          'select-none',
          'items-center',
          'gap-1',
          'px-2',
          'py-[5px]',
          'rounded-10',
          'border',
          'border-neutral-70',
          'hover:border-neutral-60',
          'focus:outline-none',
          'transition-colors',
        ])}
      >
        {/* Globe icon */}
        <div
          className={cx([
            'flex',
            'items-center',
            'justify-center',
            sizeStyles({ size }),
          ])}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-neutral-50"
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
          <span className="text-15 font-medium text-white-100">
            {selectedLanguage.value.toUpperCase()}
          </span>
        </Select.Value>

        <Select.Icon asChild>
          <ChevronDownIcon className="size-5 text-neutral-50" />
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
