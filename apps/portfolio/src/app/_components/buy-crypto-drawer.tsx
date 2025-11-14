'use client'

import { useState } from 'react'

import { Avatar, useToast } from '@status-im/components'
import { FeesIcon } from '@status-im/icons/12'
import { ExternalIcon } from '@status-im/icons/20'
import NextImage from 'next/image'

import { handleCryptoOnRamp } from '../_actions'
import { useCurrentAccount } from '../_hooks/use-current-account'
import * as Drawer from './drawer'

import type { Provider } from '../_actions'

// Todo: pass images to cloudinary?
const PROVIDERS = [
  {
    name: 'moonpay',
    description: 'The new standard for fiat to crypto',
    fee: '1% - 4.5%',
    image: '/images/providers/moonpay.png',
  },
] as const

type Props = {
  children: React.ReactElement
}

export const BuyCryptoDrawer = (props: Props) => {
  const { children } = props
  const [open, setOpen] = useState(false)

  const account = useCurrentAccount()
  const toast = useToast()

  const handleProviderSelect = async (provider: Provider) => {
    const openProviderUrl = (url: string) => {
      const newTab = window.open(url, '_blank', 'noopener,noreferrer')
      if (!newTab) {
        toast.negative(
          'Unable to open a new tab. Please check your browser settings.'
        )
      }
    }

    try {
      const data = await handleCryptoOnRamp({
        name: provider,
        address: account.address,
      })

      openProviderUrl(data.url)
    } catch {
      toast.negative(
        'Unable to open a new tab. Please check your browser settings.'
      )
    }
  }

  if (!account) {
    return null
  }

  return (
    <Drawer.Root modal open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>

      <Drawer.Content className="p-3">
        <Drawer.Header className="sticky top-1 flex flex-col gap-2 bg-white-60 backdrop-blur-[20px]">
          <Drawer.Title className="!pb-0 pl-1">Buy crypto</Drawer.Title>

          <div className="flex items-center gap-2">
            <div
              className="inline-flex h-6 items-center gap-1 rounded-8 border bg-neutral-10 pl-px pr-2"
              data-customisation={account.color}
            >
              <div className="rounded-6 bg-white-100">
                <Avatar
                  type="account"
                  name={account.name}
                  emoji={account.emoji}
                  size="20"
                  bgOpacity="20"
                />
              </div>
              <span className="text-13 font-medium text-neutral-100">
                {account.name}
              </span>
            </div>
          </div>
        </Drawer.Header>

        <Drawer.Body className="relative flex flex-col overflow-clip">
          <div className="mt-2 flex flex-col gap-0.5 rounded-16 border border-neutral-10 bg-neutral-2.5 p-1">
            {PROVIDERS.map(provider => (
              <button
                key={provider.name}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-12 px-2 py-1 transition-colors hover:bg-neutral-5"
                onClick={() => handleProviderSelect(provider.name)}
              >
                <div className="flex items-center gap-2">
                  <NextImage
                    src={provider.image}
                    alt={provider.name}
                    width={32}
                    height={32}
                    className="size-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-col items-start">
                      <div className="text-15 font-600 capitalize">
                        {provider.name}
                      </div>
                      <div className="text-13 text-neutral-50">
                        {provider.description}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-13 font-500">
                    <FeesIcon /> {provider.fee}
                  </div>
                  <ExternalIcon />
                </div>
              </button>
            ))}
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}
