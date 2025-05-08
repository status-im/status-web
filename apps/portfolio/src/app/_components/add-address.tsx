'use client'

import { DropdownMenu } from '@status-im/components'
import { AddIcon, InsightsIcon, WalletIcon } from '@status-im/icons/20'
import { ConnectKitButton } from 'connectkit'

import { useAccounts } from '../_providers/accounts-context'
import { getDefaultValues } from '../_utils/get-default-values'
import { AddressDrawer } from './address-drawer'

export const AddAddress = () => {
  const { addAccount } = useAccounts()

  return (
    <DropdownMenu.Root modal={false}>
      <button
        type="button"
        className="group flex items-center justify-center 4xl:w-full 4xl:justify-start 4xl:gap-2 4xl:pl-1"
      >
        <AddIcon
          color="$neutral-50"
          className="flex size-8 items-center justify-center gap-2 rounded-10 border border-dashed border-neutral-30 p-[6px] transition-colors group-hover:border-neutral-40"
        />
        <span className="hidden text-neutral-50 transition-colors group-hover:text-neutral-60 4xl:block">
          Add address
        </span>
      </button>

      <DropdownMenu.Content className="w-[248px]" side="right">
        <AddressDrawer
          title="Add a watched address"
          variant="create"
          onSubmit={data => {
            addAccount({
              name: data.name,
              emoji: data.emoji,
              color: data.color,
              address: data.address.toLowerCase(),
            })
          }}
          successMessage="Address added successfully"
          defaultValues={getDefaultValues()}
        >
          <DropdownMenu.Item
            icon={<InsightsIcon />}
            label="Add watched address"
            onSelect={e => {
              e.preventDefault()
            }}
          />
        </AddressDrawer>
        <ConnectKitButton.Custom>
          {({ isConnected, show }) =>
            !isConnected && (
              <DropdownMenu.Item
                icon={<WalletIcon />}
                label="Connect wallet"
                onSelect={() => {
                  show?.()
                  return false
                }}
              />
            )
          }
        </ConnectKitButton.Custom>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
