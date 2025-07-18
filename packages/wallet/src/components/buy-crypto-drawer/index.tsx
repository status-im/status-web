'use client'

import { useState } from 'react'

import { Avatar, useToast } from '@status-im/components'
import { FeesIcon } from '@status-im/icons/12'
import { ExternalIcon } from '@status-im/icons/20'

import { ERROR_MESSAGES } from '../../constants'
import * as Drawer from '../drawer'
import { Image, type ImageId } from '../image'

import type { Account } from '../address'

export type Provider = 'mercuryo' | 'moonpay'

export type Currency = {
  contract_address: string
  code: string
  label: string
  network: string
  imageUrl: string
}

type NetworkOptions = Array<{
  id: 'ETHEREUM'
  name: string
  image: ImageId
}>

const NETWORKS: NetworkOptions = [
  {
    id: 'ETHEREUM',
    name: 'Ethereum',
    image: 'Wallet/Icons/Logos/01:120:120',
  },
]

export type BuyCryptoDrawerProps = {
  children: React.ReactElement
  account?: Account
  providers?: Array<{
    name: string
    description: string
    fee: string
    image: ImageId
  }>
  onProviderSelect?: (
    provider: Provider,
    network: string,
    asset?: string,
  ) => Promise<{ url: string }>
  onOpenTab?: (url: string) => void | Promise<void>
  symbol?: string
}

type Props = BuyCryptoDrawerProps

export const BuyCryptoDrawer = (props: Props) => {
  const {
    children,
    account,
    providers = [
      {
        name: 'mercuryo',
        description: 'Buy crypto within 15 seconds',
        fee: '4.5%',
        image: 'Wallet/Icons/Logos/mercuryo:64:64',
      },
      {
        name: 'moonpay',
        description: 'The new standard for fiat to crypto',
        fee: '1% - 4.5%',
        image: 'Wallet/Icons/Logos/moonpay:64:64',
      },
    ],
    onProviderSelect,
    onOpenTab,
    symbol,
  } = props

  const [open, setOpen] = useState(false)
  const network: NetworkOptions[0] = NETWORKS[0]
  const currency: Currency = {
    contract_address: '',
    code: symbol || 'ETH',
    label: symbol || 'Ethereum',
    network: 'ETHEREUM',
    imageUrl: '/images/tokens/usd.png',
  }

  const toast = useToast()

  const handleProviderSelect = async (provider: Provider) => {
    if (!account) return

    try {
      let url: string

      if (onProviderSelect) {
        const data = await onProviderSelect(provider, network.id, currency.code)
        url = data.url
      } else {
        const providerUrls = {
          mercuryo: `https://exchange.mercuryo.io/?type=buy&network=${network.id}&currency=${currency.code}&address=${account.address}&hide_address=false&fix_address=true&widget_id=6a7eb330-2b09-49b7-8fd3-1c77cfb6cd47`,
          moonpay: `https://buy.moonpay.com?apiKey=pk_live_YQC6CQPA5qqDu0unEwHJyAYQyeIqFGR`,
        }

        url = providerUrls[provider]
        if (!url) {
          toast.negative(ERROR_MESSAGES.PROVIDER_NOT_SUPPORTED)
          return
        }
      }

      if (onOpenTab) {
        onOpenTab(url)
      } else {
        const newTab = window.open(url, '_blank', 'noopener,noreferrer')

        if (!newTab) {
          toast.negative(ERROR_MESSAGES.NEW_TAB)
        }
      }
    } catch {
      toast.negative(ERROR_MESSAGES.NEW_TAB)
    }
  }

  // Removed unused useEffect hook as it had no side effects

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

            {/* Removed isMercuryoSelected and its related ContextTag */}
          </div>
        </Drawer.Header>

        <Drawer.Body className="relative flex flex-col overflow-clip">
          <div className="mt-2 flex flex-col gap-0.5 rounded-16 border border-neutral-10 bg-neutral-2.5 p-1">
            {providers.map(provider => {
              return (
                <button
                  key={provider.name}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-12 px-2 py-1 transition-colors hover:bg-neutral-5"
                  onClick={() =>
                    handleProviderSelect(provider.name as Provider)
                  }
                >
                  <div className="flex items-center gap-2">
                    <Image
                      id={provider.image}
                      alt={provider.name}
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
              )
            })}
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}
