'use client'

import { Button, Text } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'

import type {} from 'react'

export type SelectableAccount = {
  chain: string
  address: string
}

type Props = {
  accounts: SelectableAccount[]
  onSelect: (account: SelectableAccount) => void
  onBack: () => void
}

function AccountSelect({ accounts, onSelect, onBack }: Props) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <Button
          onClick={onBack}
          variant="grey"
          icon={<ArrowLeftIcon color="$neutral-100" />}
          aria-label="Back"
          size="32"
        />
      </div>
      <Text size={27} weight="semibold">
        Select account
      </Text>
      <Text size={15} color="$neutral-50">
        Multiple accounts were found in the QR code. Select one to import.
      </Text>
      <div className="flex flex-col gap-2">
        {accounts.map(account => (
          <button
            key={account.address}
            onClick={() => onSelect(account)}
            className="flex flex-col gap-1 rounded-12 border border-neutral-10 bg-neutral-2.5 p-3 text-left hover:bg-neutral-5"
          >
            <Text size={13} color="$neutral-50">
              {account.chain === 'evm' ? 'Ethereum' : account.chain}
            </Text>
            <Text size={13} weight="medium" className="break-all">
              {account.address}
            </Text>
          </button>
        ))}
      </div>
    </div>
  )
}

export { AccountSelect }
export type { Props as AccountSelectProps }
