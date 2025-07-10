'use client'

import { cloneElement } from 'react'

import { DropdownButton, DropdownMenu } from '@status-im/components'

import { Image } from '../_components/assets'
import { useQueryState } from '../_hooks/use-query-state'

import type { NetworkType } from '@status-im/wallet/data'

const NETWORKS = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: <Image id="Wallet/Icons/Logos/01:120:120" alt="mainnet" />,
  },
] as const

// const CURRENCY = 'EUR'

// const formatCurrency = (amount: number, currency?: string) => {
//   return Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: currency || 'USD',
//     maximumFractionDigits: 2,
//   }).format(amount)
// }

const BALANCE_NETWORKS: Array<{ network: NetworkType; balance: number }> = [
  {
    network: 'ethereum',
    balance: 412342.23,
  },
]

export const NetworksFilter = () => {
  const balance = BALANCE_NETWORKS

  const [selected, onSelect] = useQueryState<NetworkType[]>(
    'networks',
    balance.map(({ network }) => network)
  )

  const handleSelect = (network: NetworkType) => {
    const newSelected = selected.includes(network)
      ? selected.filter(selectedNetwork => selectedNetwork !== network)
      : [...selected, network]

    onSelect(newSelected.length === 3 ? [] : newSelected)
  }

  return (
    <div className="mt-1 flex items-center space-x-2">
      <DropdownMenu.Root modal={false}>
        <DropdownButton size="24" variant="outline">
          <div className="-ml-1 flex items-center">
            {NETWORKS.filter((_, index) =>
              selected.includes(NETWORKS[index].id)
            ).map(network => {
              return cloneElement(network.icon, {
                key: network.id,
                className:
                  '-ml-1 size-[16px] rounded-full border border-white-100 first:ml-0',
              })
            })}
          </div>
        </DropdownButton>
        <DropdownMenu.Content>
          {NETWORKS.map(option => {
            // const networkBalance = balance.find(
            //   network => network.network === option.id
            // )!

            return (
              <DropdownMenu.CheckboxItem
                icon={option.icon}
                key={option.id}
                label={
                  option.name
                  // +
                  // ' ' +
                  // formatCurrency(networkBalance.balance, CURRENCY)
                }
                onCheckedChange={() => handleSelect(option.id)}
                checked={selected.length === 0 || selected.includes(option.id)}
                disabled={selected.length === 1 && selected.includes(option.id)}
                onSelect={e => e.preventDefault()}
              />
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
