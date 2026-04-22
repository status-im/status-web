import {
  Avatar,
  Button,
  DropdownMenu,
  Tag,
  /*Tooltip*/
} from '@status-im/components'
import {
  AddIcon,
  ChevronDownIcon,
  ImportIcon,
  WalletIcon,
} from '@status-im/icons/20'
// import { shortenAddress } from '@status-im/wallet/components'
import { useNavigate } from '@tanstack/react-router'

import { useWallet } from '@/providers/wallet-context'

type Props = {
  className?: string
}

const DEFAULT_ACCOUNT_EMOJI = '🍑'
const DEFAULT_ACCOUNT_NAME = 'Account 1'

export function WalletSelector(props: Props) {
  const { className } = props
  const navigate = useNavigate()
  const { wallets, currentWallet /*, currentAccount*/, setCurrentWallet } =
    useWallet()
  const isWatchOnly = currentWallet?.type === 'hardware-qr'

  if (!currentWallet) {
    return null
  }

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
          // TODO: Use currently selected account name instead when multi-account support is implemented.
          name={currentWallet.name ?? DEFAULT_ACCOUNT_NAME}
          emoji={DEFAULT_ACCOUNT_EMOJI}
          bgOpacity="20"
        />
        <div className="hidden items-center gap-2 xl:flex">
          <div className="text-15 font-semibold text-neutral-100">
            {currentWallet.name}
          </div>
          {isWatchOnly && (
            <Tag
              size="24"
              label="Watch only"
              aria-label="Watch-only wallet"
              className="border-neutral-20 bg-neutral-5 text-neutral-50 hover:border-neutral-30"
            />
          )}
          {/* TODO: Uncomment to display current account's name
          when multi-account support is implemented */}
          {/* {currentAccount?.address ? (
            <Tooltip content={DEFAULT_ACCOUNT_NAME} side="top">
              <div className="text-13 font-medium text-neutral-50">
                {shortenAddress(currentAccount.address)}
              </div>
            </Tooltip>
          ) : null} */}
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
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
