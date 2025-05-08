'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Avatar,
  Button,
  ContextTag,
  DropdownButton,
  DropdownMenu,
  useToast,
} from '@status-im/components'
import { FeesIcon } from '@status-im/icons/12'
import { ArrowLeftIcon } from '@status-im/icons/16'
import { ChevronRightIcon, ExternalIcon, LabelsIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import NextImage from 'next/image'

import { getSupportedCurrencies, handleCryptoOnRamp } from '../_actions'
import { useCurrentAccount } from '../_hooks/use-current-account'
import { Image, type ImageId } from './assets'
import * as Drawer from './drawer'

import type { Currency, Provider } from '../_actions'

// Todo: pass images to cloudinary?
const PROVIDERS = [
  {
    name: 'mercuryo',
    description: 'Buy crypto within 15 seconds',
    fee: '4.5%',
    image: '/images/providers/mercuryo.png',
  },

  {
    name: 'ramp',
    description: 'Global crypto to fiat flow',
    fee: '0.49% - 4.5%',
    image: '/images/providers/ramp.png',
  },
  {
    name: 'moonpay',
    description: 'The new standard for fiat to crypto',
    fee: '1% - 4.5%',
    image: '/images/providers/moonpay.png',
  },
] as const

type NetworkOptions = Array<{
  id: 'ETHEREUM' | 'OPTIMISM' | 'ARBITRUM' | 'BASE' | 'POLYGON' | 'BSC'
  name: string
  image: ImageId
}>

const NETWORKS: NetworkOptions = [
  {
    id: 'ETHEREUM',
    name: 'Ethereum',
    image: 'Wallet/Icons/Logos/01:120:120',
  },
  {
    id: 'OPTIMISM',
    name: 'Optimism',
    image: 'Wallet/Icons/Logos/02:120:120',
  },
  {
    id: 'ARBITRUM',
    name: 'Arbitrum',
    image: 'Wallet/Icons/Logos/03:120:120',
  },
  {
    id: 'BASE',
    name: 'Base',
    // fixme: export correct image
    image: 'Wallet/Icons/Logos/01:120:120',
  },
  {
    id: 'POLYGON',
    name: 'Polygon',
    image: 'Wallet/Icons/Logos/01:120:120',
  },
  {
    id: 'BSC',
    name: 'BSC',
    image: 'Wallet/Icons/Logos/01:120:120',
  },
]

type Props = {
  children: React.ReactElement
}

export const BuyCryptoDrawer = (props: Props) => {
  const { children } = props
  const [open, setOpen] = useState(false)

  const [isMercuryoSelected, setIsMercuryoSelected] = useState(false)
  const [network, setNetwork] = useState<NetworkOptions[0]>(NETWORKS[0])

  const [allCurrencies, setAllCurrencies] = useState<Currency[]>([])
  const [currency, setCurrency] = useState<Currency>()

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
        network: network.id,
        address: account.address,
        asset: currency?.code,
      })

      openProviderUrl(data.url)
    } catch {
      toast.negative(
        'Unable to open a new tab. Please check your browser settings.'
      )
    }
  }

  useEffect(() => {
    if (open === false) {
      setCurrency(undefined)
      setIsMercuryoSelected(false)
    }
  }, [open])

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getSupportedCurrencies()

        setAllCurrencies(data)
      } catch (error) {
        toast.negative(
          'Failed to fetch supported currencies. Please try again later.'
        )
        console.error(error)
      }
    }

    fetchCurrencies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredCurrencies = useMemo(() => {
    return allCurrencies.filter(currency => currency.network === network.id)
  }, [allCurrencies, network])

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

            {isMercuryoSelected && (
              <>
                <span className="text-13 font-medium text-neutral-50">via</span>
                <ContextTag
                  type="icon"
                  label="Mercuryo"
                  icon={
                    <NextImage
                      src={PROVIDERS[0].image}
                      alt={PROVIDERS[0].name}
                      width={20}
                      height={20}
                    />
                  }
                />
              </>
            )}
          </div>
        </Drawer.Header>

        <Drawer.Body className="relative flex flex-col overflow-clip">
          <div
            className={cx(
              'absolute inset-y-0 left-0 mt-2 inline-flex w-full transform flex-col gap-3 transition-transform duration-300 ease-in-out',
              isMercuryoSelected ? 'translate-x-0' : 'translate-x-full'
            )}
          >
            <div className="flex flex-col gap-2 rounded-16 border border-neutral-10 p-3">
              <p className="text-13 font-500 text-neutral-50">
                Select network to buy asset on
              </p>
              <DropdownMenu.Root>
                <DropdownButton size="40" variant="outline">
                  <div className="flex items-center gap-2">
                    <Image id={network.image} alt="" width={20} height={20} />
                    {network.name}
                  </div>
                </DropdownButton>
                <DropdownMenu.Content>
                  {NETWORKS.map(option => {
                    return (
                      <DropdownMenu.Item
                        icon={
                          <Image
                            id={option.image}
                            alt=""
                            width={20}
                            height={20}
                          />
                        }
                        key={option.id}
                        label={option.name}
                        onSelect={() => {
                          setNetwork(option)
                        }}
                        selected={option.id === network.id}
                      />
                    )
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
            <div className="relative flex flex-col gap-2 rounded-16 border border-neutral-10 p-3">
              <div className="absolute -top-3 left-5 h-3 w-px bg-neutral-10" />
              <p className="text-13 font-500 text-neutral-50">Select asset</p>
              <DropdownMenu.Root>
                <DropdownButton size="40" variant="outline">
                  <div className="flex items-center gap-2">
                    {currency ? (
                      <>
                        <NextImage
                          src={currency.imageUrl}
                          alt={currency.code}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <div className="flex items-center gap-1">
                          <p className="text-15 font-500">{currency.label}</p>
                          <p className="text-13 font-500 text-neutral-50">
                            {currency.code}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-13 font-500 text-neutral-50">
                        Select a currency
                      </p>
                    )}
                  </div>
                </DropdownButton>
                <DropdownMenu.Content>
                  {filteredCurrencies.map(option => {
                    return (
                      <DropdownMenu.Item
                        icon={
                          <NextImage
                            src={option.imageUrl}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        }
                        key={option.code}
                        label={option.label}
                        // secondaryLabel={opti+on.code}
                        onSelect={() => setCurrency(option)}
                        selected={option.code === currency?.code}
                      />
                    )
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </div>

          <div
            className={cx(
              'mt-2 flex flex-col gap-0.5 rounded-16 border border-neutral-10 bg-neutral-2.5 p-1',
              'absolute left-0 z-50 w-full transform transition-transform duration-300 ease-in-out',
              isMercuryoSelected ? '-translate-x-full' : 'translate-x-0'
            )}
          >
            {PROVIDERS.map(provider => {
              if (provider.name === 'mercuryo') {
                return (
                  <button
                    key={provider.name}
                    className="flex cursor-pointer items-center justify-between gap-4 rounded-12 px-2 py-1 transition-colors hover:bg-neutral-5"
                    onClick={() => setIsMercuryoSelected(true)}
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
                          <div className="text-left text-13 text-neutral-50">
                            {provider.description}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-13 font-500">
                        <FeesIcon /> <LabelsIcon /> {provider.fee}
                      </div>
                      <ChevronRightIcon color="$neutral-50" />
                    </div>
                  </button>
                )
              }

              return (
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
              )
            })}
          </div>

          <div
            className={cx(
              'absolute bottom-0 z-20 grid w-full transform grid-cols-[auto_1fr] gap-2 transition-transform duration-300 ease-in-out',
              isMercuryoSelected ? 'translate-y-0' : 'translate-y-full'
            )}
          >
            <Button
              type="button"
              variant="grey"
              onPress={() => {
                setCurrency(undefined)
                setIsMercuryoSelected(false)
              }}
              icon={<ArrowLeftIcon />}
              aria-label="Back"
            />
            <Button
              type="submit"
              disabled={!network || !currency}
              iconAfter={<ExternalIcon />}
              onClick={() => handleProviderSelect('mercuryo')}
            >
              Buy via Mercuryo
            </Button>
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}
