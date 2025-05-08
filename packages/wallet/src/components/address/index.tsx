'use client'
import { useEffect, useState } from 'react'

import { Avatar } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/16'
import { InsightsIcon } from '@status-im/icons/20'
import { match } from 'ts-pattern'

import { AccountMenu } from '../account-menu'
import { CurrencyAmount } from '../currency-amount'
import { ShortenAddress } from '../shorten-address'
import { Tooltip } from '../tooltip'

import type { CustomisationColorType } from '@status-im/components'

type Account = {
  name: string
  emoji: string
  color: CustomisationColorType
  address: string
  wallet?: {
    connector: string
    connected: boolean
  }
}

type Props = {
  showOptions?: boolean
  account?: Account
  activeAccounts?: Account[]
} & (
  | {
      variant: 'balance'
      balance: number
    }
  | {
      variant: 'address-info'
    }
)

const Address = (props: Props) => {
  const {
    showOptions = true,
    variant = 'address-info',
    account,
    activeAccounts,
  } = props

  const [isTooltipOpen, setIsTooltipOpen] = useState(
    activeAccounts?.length === 1 && account?.name === 'Address 1',
  )

  useEffect(() => {
    setTimeout(() => {
      setIsTooltipOpen(false)
    }, 4000)
  }, [])

  if (!account) return null

  return (
    <div
      className="flex items-center gap-1.5"
      data-customisation={account.color}
    >
      <Avatar
        type="account"
        name={account.name}
        emoji={account.emoji}
        size="24"
        bgOpacity="20"
      />
      <div className="text-15 font-semibold text-neutral-100">
        {account.name}
      </div>
      <div className="flex items-center gap-2 text-13 font-medium text-neutral-50">
        {match(variant)
          .with('address-info', () => (
            <ShortenAddress address={account.address} />
          ))
          .with('balance', () => (
            <CurrencyAmount
              value={(props as { balance: number }).balance}
              className="text-15 font-semibold text-neutral-50"
              format="standard"
            />
          ))
          .exhaustive()}
        {!account.wallet && (
          <Tooltip label="Watched address" hidden={false} side="top">
            <InsightsIcon color="$neutral-50" />
          </Tooltip>
        )}
      </div>
      {showOptions && (
        <>
          <AccountMenu size="24" account={account} />{' '}
          <Tooltip
            label={
              <div className="flex items-center gap-2">
                <ArrowLeftIcon className="text-neutral-50" />
                Rename your address
              </div>
            }
            side="right"
            sideOffset={-10}
            defaultOpen={isTooltipOpen}
            children={<div className="size-2 bg-white-50" />}
          />
        </>
      )}
    </div>
  )
}

export { Address }
export type { Account, Props as AddressProps }
