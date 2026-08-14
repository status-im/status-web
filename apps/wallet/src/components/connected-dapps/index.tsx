'use client'

import { useCallback, useEffect, useState } from 'react'

import { Button, DropdownMenu } from '@status-im/components'
import {
  BrowserIcon,
  ConnectIcon,
  ConnectionIcon,
  DisconnectIcon,
} from '@status-im/icons/20'
import { shortenAddress } from '@status-im/wallet/components'

import {
  ETH_ACCOUNTS_CAPABILITY,
  isSameAddress,
  readStore,
  watchPermissions,
} from '../../data/dapp-permissions'
import { connectAccountToDapp, disconnectDapp } from '../../lib/dapp-events'
import { useWallet } from '../../providers/wallet-context'

type ConnectedDApp = {
  origin: string
  /** The account this dApp currently sees, which outlives a wallet switch. */
  connectedAddress: string | null
  /** Whether the account selected in the wallet is connected here at all. */
  hasCurrentAccount: boolean
}

/**
 * dApp connection management, in its own menu beside the wallet selector.
 *
 * Switching to an account a dApp was never connected to deliberately leaves
 * that dApp on the account it was connected with, so this is where the user
 * connects the new one.
 *
 * Renders nothing until at least one dApp is connected -- there is nothing to
 * manage before that, and an always-present button would open an empty menu.
 */
const ConnectedDApps = () => {
  const { currentAccount } = useWallet()
  const address = currentAccount?.address

  const [dapps, setDapps] = useState<ConnectedDApp[]>([])

  const load = useCallback(async () => {
    const store = await readStore()

    setDapps(
      Object.entries(store.origins)
        .filter(([, record]) =>
          record.permissions.some(
            permission =>
              permission.parentCapability === ETH_ACCOUNTS_CAPABILITY,
          ),
        )
        .map(([origin, record]) => ({
          origin,
          connectedAddress: record.selectedAddress,
          hasCurrentAccount: record.accounts.some(account =>
            isSameAddress(account, address ?? null),
          ),
        })),
    )
  }, [address])

  useEffect(() => {
    void load()
    return watchPermissions(() => void load())
  }, [load])

  // No approval popup: choosing this in the wallet is the consent the popup
  // would have collected.
  const connect = useCallback(
    async (origin: string) => {
      if (!address) return
      await connectAccountToDapp(origin, address)
      await load()
    },
    [address, load],
  )

  const disconnect = useCallback(
    async (origin: string) => {
      await disconnectDapp(origin)
      await load()
    },
    [load],
  )

  if (dapps.length === 0) {
    return null
  }

  return (
    <DropdownMenu.Root modal={false}>
      <Button
        size="24"
        variant="outline"
        icon={<ConnectionIcon />}
        aria-label={`Manage dApp connections (${dapps.length} connected)`}
      />

      <DropdownMenu.Content className="w-[280px]">
        <DropdownMenu.Label>Connected dApps</DropdownMenu.Label>
        {dapps.map(dapp => (
          <DropdownMenu.Sub key={dapp.origin}>
            <DropdownMenu.SubTrigger
              icon={<BrowserIcon />}
              label={formatOrigin(dapp.origin)}
            />
            <DropdownMenu.SubContent className="w-[260px]">
              {dapp.connectedAddress && (
                <DropdownMenu.Label>
                  Using {shortenAddress(dapp.connectedAddress)}
                </DropdownMenu.Label>
              )}
              {address && !dapp.hasCurrentAccount && (
                <DropdownMenu.Item
                  icon={<ConnectIcon />}
                  label={`Connect ${shortenAddress(address)}`}
                  onSelect={() => {
                    void connect(dapp.origin)
                  }}
                />
              )}
              <DropdownMenu.Item
                label="Open site"
                external
                onSelect={() => {
                  window.open(dapp.origin, '_blank')
                }}
              />
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                icon={<DisconnectIcon />}
                label="Disconnect"
                danger
                onSelect={() => {
                  void disconnect(dapp.origin)
                }}
              />
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

function formatOrigin(origin: string): string {
  try {
    return new URL(origin).hostname
  } catch {
    return origin
  }
}

export { ConnectedDApps }
