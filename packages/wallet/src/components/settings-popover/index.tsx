'use client'

import { useState } from 'react'

import { DropdownMenu } from '@status-im/components'
// import {
//   DarkIcon,
//   DesktopIcon,
//   ExternalIcon,
//   LightIcon,
// } from '@status-im/icons/16'
import { SettingsIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
// import Link from 'next/link'

// import type React from 'react'

// type Segment = 'dark' | 'light' | 'system'

// TODO - fetch the list of currencies that we support when possible
// const CURRENCIES = [
//   { label: 'EUR', value: 'EUR' },
//   { label: 'USD', value: 'USD' },
//   { label: 'GBP', value: 'GBP' },
// ]

export const SettingsPopover = () => {
  const [isOpen, setIsOpen] = useState(false)
  // const [currencyOpen, setCurrencyOpen] = useState(false)

  // TODO: Implement the switch logic when possible. useState is used as a placeholder
  // Comment everything that will not be used for v0
  const [hideSmallBalances, setHideSmallBalances] = useState(false)
  const [hideSmallTokens, setHideSmallTokens] = useState(false)
  const [shareUsageData, setShareUsageData] = useState(false)
  // const [currency, setCurrency] = useState('EUR')

  // const [theme, setTheme] = useState<Segment>(() => {
  //   return (localStorage.getItem('theme') as Segment) || 'system'
  // })

  // useEffect(() => {
  //   const root = document.documentElement

  //   const applyTheme = (newTheme: Segment) => {
  //     const themeToApply =
  //       newTheme === 'system'
  //         ? window.matchMedia('(prefers-color-scheme: dark)').matches
  //           ? 'dark'
  //           : 'light'
  //         : newTheme

  //     root.classList.remove('dark', 'light')
  //     root.classList.add(themeToApply)
  //   }

  //   applyTheme(theme)
  //   localStorage.setItem('theme', theme)
  // }, [theme])

  // const handleSegmentChange = (value: Segment) => {
  //   setTheme(value)
  // }

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen} open={isOpen}>
      <button className="flex cursor-pointer select-none items-center rounded-10 border border-neutral-70 hover:border-neutral-60">
        <div
          className={cx(
            'flex size-[30px] items-center justify-center rounded-12 border transition',
            isOpen
              ? 'border-neutral-80 opacity-[40%]'
              : 'border-transparent opacity-[100%]',
          )}
        >
          <div
            className={cx([
              'size-6 text-white-100 transition',
              'flex items-center justify-center',
              isOpen ? 'rounded-8' : 'rounded-full',
            ])}
          >
            <SettingsIcon className="text-neutral-40" />
          </div>
        </div>
      </button>

      <DropdownMenu.Content collisionPadding={24} className="w-[270px]">
        <DropdownMenu.Label>Settings</DropdownMenu.Label>

        <DropdownMenu.SwitchItem
          label="Hide small balances"
          checked={hideSmallBalances}
          onCheckedChange={setHideSmallBalances}
          onSelect={e => e.preventDefault()}
        />
        <DropdownMenu.SwitchItem
          label="Hide small tokens"
          checked={hideSmallTokens}
          onCheckedChange={setHideSmallTokens}
          onSelect={e => e.preventDefault()}
        />
        <DropdownMenu.SwitchItem
          label="Share usage data"
          checked={shareUsageData}
          onCheckedChange={setShareUsageData}
          onSelect={e => e.preventDefault()}
        />

        <DropdownMenu.Separator />

        <DropdownMenu.Item
          label="status.app"
          external
          onSelect={() => {
            window.open('https://status.app', '_blank')
          }}
        />
        <DropdownMenu.Item
          label="Request feature"
          external
          onSelect={() => {
            window.open('https://status.app', '_blank')
          }}
        />
        <DropdownMenu.Item
          label="Help"
          external
          onSelect={() => {
            window.open('https://status.app/help', '_blank')
          }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
