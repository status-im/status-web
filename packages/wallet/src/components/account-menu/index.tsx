'use client'
import { useEffect, useState } from 'react'

import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Button, DropdownMenu, useToast } from '@status-im/components'
import {
  BrowserIcon,
  CheckIcon,
  CopyIcon,
  DeleteIcon,
  DisconnectIcon,
  //   EditIcon,
  ExternalIcon,
  OptionsIcon,
  QrCodeIcon,
  //   QrCodeIcon,
} from '@status-im/icons/20'

import { DeleteAddressAlert } from '../delete-address-alert'
import { NetworkExplorerLogo } from '../network-explorer-logo'
import { NetworkLogo } from '../network-logo'
// import { AddressDrawer } from './address-drawer'
import { ReceiveCryptoDrawer } from '../receive-crypto-drawer'
import { shortenAddress } from '../shorten-address'

import type { Account } from '../address'

type Props = {
  size: '24' | '32'
  account: Account
  onCopy?: (address: string) => void
  //   onEdit: (account: Partial<Account>) => void
  onRemove?: (address: string) => void
  onDisconnect?: (address: string) => void
}

const AccountMenu = (props: Props) => {
  const { size, onCopy, account, onDisconnect, onRemove } = props

  const [copied, setCopied] = useState(false)

  const toast = useToast()

  const copyText = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    onCopy?.(account.address)
    setCopied(true)
  }

  const handleRemove = async (address: string) => {
    onRemove?.(address)
    toast.positive(`${address} was successfully removed`)
  }

  const handleDisconnect = async (address: string) => {
    onDisconnect?.(address)

    setTimeout(() => {
      toast.positive(`${shortenAddress(address)} successfully disconnected`)
    }, 300)
  }

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }

    return
  }, [copied])

  return (
    <>
      <DropdownMenu.Root modal={false}>
        <Button
          icon={<OptionsIcon />}
          aria-label="Account menu"
          variant="outline"
          size={size}
        />

        <DropdownMenu.Content className="w-[248px]">
          {/* <AddressDrawer
            title="Edit address"
            variant="edit"
            onSubmit={data => {
              onEdit(data)
            }}
            successMessage="Address edited successfully"
            defaultValues={account}
          >
            <DropdownMenu.Item
              icon={<EditIcon />}
              label="Edit address"
              onSelect={e => e.preventDefault()}
            />
          </AddressDrawer> */}

          <DropdownMenu.Item
            icon={
              copied ? (
                <CheckIcon className="text-success-50" />
              ) : (
                <CopyIcon className="text-neutral-50" />
              )
            }
            onClick={e => copyText(e)}
            onSelect={() => console.log('copy address')}
            label={copied ? 'Address copied' : 'Copy address'}
          />
          <ReceiveCryptoDrawer onCopy={onCopy} account={account}>
            <DropdownMenu.Item
              label="Show address QR"
              icon={<QrCodeIcon />}
              onSelect={e => e.preventDefault()}
            />
          </ReceiveCryptoDrawer>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className="flex flex-1 justify-between"
              label="View on explorer"
              icon={<BrowserIcon />}
            />

            <DropdownMenu.SubContent
              sideOffset={0}
              alignOffset={0}
              className="z-30 m-auto mb-0 w-[248px] justify-start rounded-12 border border-neutral-10 bg-white-100 p-1 shadow-3"
            >
              <DropdownMenuLink
                label={
                  <>
                    <NetworkExplorerLogo name="etherscan" />
                    Etherscan
                  </>
                }
                href={'https://etherscan.io/address/' + account.address}
              />
              <DropdownMenuLink
                label={
                  <>
                    <NetworkLogo name="optimism" size={16} />
                    Optimism Explorer
                  </>
                }
                href={
                  'https://optimistic.etherscan.io/address/' + account.address
                }
              />
              <DropdownMenuLink
                label={
                  <>
                    <NetworkExplorerLogo name="arbiscan" />
                    Arbiscan
                  </>
                }
                href={'https://arbiscan.io/address/' + account.address}
              />
              <DropdownMenuLink
                label={
                  <>
                    <NetworkExplorerLogo name="basescan" />
                    Base Explorer
                  </>
                }
                href={'https://basescan.org/tx/' + account.address}
              />
              <DropdownMenuLink
                label={
                  <>
                    <NetworkExplorerLogo name="polygonscan" />
                    Polygon Explorer
                  </>
                }
                href={'https://polygonscan.com/tx/' + account.address}
              />
              <DropdownMenuLink
                label={
                  <>
                    <NetworkExplorerLogo name="bscscan" />
                    BSC Explorer
                  </>
                }
                href={'https://bscscan.com/tx/' + account.address}
              />
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          {account && (
            <>
              <DropdownMenu.Separator />
              {!account.wallet?.connected ? (
                <DeleteAddressAlert
                  title="Remove address"
                  address={account.address}
                  onConfirm={() => handleRemove(account.address)}
                  confirmButtonLabel="Remove address"
                >
                  <DropdownMenu.Item
                    label="Remove address"
                    icon={<DeleteIcon />}
                    onSelect={e => e.preventDefault()}
                    danger
                  />
                </DeleteAddressAlert>
              ) : (
                <DeleteAddressAlert
                  title="Disconnect wallet"
                  address={account.address}
                  onConfirm={() => handleDisconnect(account.address)}
                  description="Are you sure you want to disconnect this wallet?"
                  confirmButtonLabel="Disconnect wallet"
                >
                  <DropdownMenu.Item
                    label="Disconnect wallet"
                    icon={<DisconnectIcon />}
                    onSelect={e => e.preventDefault()}
                    danger
                  />
                </DeleteAddressAlert>
              )}
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}

type AccountMenuItemProps = {
  label: React.ReactNode
  href: string
}

const DropdownMenuLink = (props: AccountMenuItemProps) => {
  const { label, href } = props

  return (
    <DropdownMenuItem
      className="flex flex-1 cursor-pointer select-none items-center justify-start gap-2 rounded-10 px-2 py-[5px] outline-none active:bg-neutral-10 data-[highlighted]:bg-neutral-5"
      asChild
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center gap-2"
      >
        <div className="flex flex-1 items-center justify-between text-15 font-medium">
          <div className="flex items-center gap-2">{label}</div>
        </div>
        <ExternalIcon className="text-neutral-50" />
      </a>
    </DropdownMenuItem>
  )
}

export { AccountMenu }
