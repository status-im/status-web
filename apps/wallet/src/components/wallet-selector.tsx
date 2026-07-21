import { Avatar, Button, DropdownMenu, Tooltip } from '@status-im/components'
import {
  AddIcon,
  ChevronDownIcon,
  ImportIcon,
  KeycardIcon,
  WalletIcon,
} from '@status-im/icons/20'
import { shortenAddress } from '@status-im/wallet/components'
import { useNavigate } from '@tanstack/react-router'

import { useWallet } from '@/providers/wallet-context'

import { WatchOnlyTag } from './watch-only-tag'

type Props = {
  className?: string
}

const DEFAULT_ACCOUNT_EMOJI = '🍑'
const DEFAULT_ACCOUNT_NAME = 'Account 1'

// SLIP-44 coin type for Ethereum. The account switcher only surfaces EVM
// accounts because the current account drives the (EVM-only) portfolio views.
const ETHEREUM_COIN_TYPE = 60

export function WalletSelector(props: Props) {
  const { className } = props
  const navigate = useNavigate()
  const {
    wallets,
    currentWallet,
    currentAccount,
    setCurrentWallet,
    setCurrentAccount,
  } = useWallet()
  const isWatchOnly = currentWallet?.type === 'hardware-qr'

  if (!currentWallet) {
    return null
  }

  const selectableAccounts = currentWallet.accounts.filter(
    account => account.coin === ETHEREUM_COIN_TYPE,
  )

  return (
    <div
      className={['inline-flex items-center gap-2.5', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="inline-flex items-center gap-1.5 rounded-10">
        <Avatar
          type="account"
          size="24"
          // TODO: Use currently selected account name instead when named accounts are supported.
          name={currentWallet.name ?? DEFAULT_ACCOUNT_NAME}
          emoji={DEFAULT_ACCOUNT_EMOJI}
          bgOpacity="20"
        />
        <div className="hidden items-center gap-2 xl:flex">
          <div className="text-15 font-semibold text-neutral-100">
            {currentWallet.name}
          </div>
          {isWatchOnly && <WatchOnlyTag />}
          {currentAccount?.address ? (
            <Tooltip content={currentAccount.address} side="top">
              <div className="text-13 font-medium text-neutral-50">
                {shortenAddress(currentAccount.address)}
              </div>
            </Tooltip>
          ) : null}
        </div>
      </div>

      <DropdownMenu.Root modal={false}>
        <Button
          size="24"
          variant="outline"
          icon={<ChevronDownIcon />}
          aria-label="Open wallet menu"
        />

        <DropdownMenu.Content className="w-[320px]">
          <DropdownMenu.Label>Wallets</DropdownMenu.Label>
          {wallets.map(wallet => (
            <DropdownMenu.Item
              key={wallet.id}
              icon={<WalletIcon />}
              label={wallet.name}
              selected={wallet.id === currentWallet.id}
              onClick={() => setCurrentWallet(wallet.id)}
            />
          ))}

          {selectableAccounts.length > 0 && (
            <>
              <DropdownMenu.Separator />
              <DropdownMenu.Label>Accounts</DropdownMenu.Label>
              {selectableAccounts.map(account => (
                <DropdownMenu.Item
                  key={account.address}
                  icon={<WalletIcon />}
                  label={shortenAddress(account.address)}
                  selected={account.address === currentAccount?.address}
                  onClick={() => setCurrentAccount(account.address)}
                />
              ))}
              {currentWallet.type === 'mnemonic' && (
                <DropdownMenu.Item
                  icon={<AddIcon />}
                  label="Create account"
                  onClick={() => {
                    navigate({ to: '/wallet-flow/add-account' })
                  }}
                />
              )}
            </>
          )}

          <DropdownMenu.Separator />
          <DropdownMenu.Item
            icon={<AddIcon />}
            label="Create wallet"
            onClick={() => {
              navigate({ to: '/wallet-flow/new' })
            }}
          />
          <DropdownMenu.Item
            icon={<ImportIcon />}
            label="Import wallet"
            onClick={() => {
              navigate({ to: '/wallet-flow/import' })
            }}
          />
          <DropdownMenu.Item
            icon={<KeycardIcon />}
            label="Connect hardware wallet"
            onClick={() => {
              navigate({ to: '/wallet-flow/import-hardware' })
            }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
