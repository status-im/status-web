'use client'

import { useState } from 'react'

import { Avatar, useToast } from '@status-im/components'

import { ERROR_MESSAGES } from '../../constants'
import * as Drawer from '../drawer'
import {
  getProviderUrl,
  ProviderCard,
  type ProviderInfo,
  PROVIDERS,
} from '../provider-card'

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
}>

const NETWORKS: NetworkOptions = [
  {
    id: 'ETHEREUM',
    name: 'Ethereum',
  },
]

export type BuyCryptoDrawerProps = {
  children: React.ReactElement
  account?: Account
  providers?: ProviderInfo[]
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
    providers = PROVIDERS,
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
        url = getProviderUrl(provider, account.address, {
          network: network.id,
          currency: currency.code,
        })

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
          <Drawer.Title className="!pb-0 pl-1">Ways to buy tokens</Drawer.Title>

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
          <div className="mt-2 flex flex-col gap-3">
            {providers.map(provider => (
              <ProviderCard
                key={provider.name}
                {...provider}
                onClick={() =>
                  handleProviderSelect(provider.name.toLowerCase() as Provider)
                }
              />
            ))}
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}
