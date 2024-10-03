import { useLocalStorage } from '~hooks/use-local-storage'
import { getFaviconUrl } from '~lib/get-favicon-url'

import { Network } from './network'
import { Switch } from './switch'

const Connected = () => {
  const [defaultWallet, setDefaultWallet] = useLocalStorage(
    'status:default-wallet',
    true,
  )
  const [, setReopen] = useLocalStorage('status:popup:reopen', false)

  const dappUrl = window.location.hostname
  const dappIcon = getFaviconUrl()

  return (
    <>
      <div className="mb-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* fixme: set default favicon `onerror` */}
          {dappIcon ? (
            <img src={dappIcon} alt="icon" className="size-8 rounded-full" />
          ) : (
            <div className="size-8 rounded-full bg-neutral-5" />
          )}
          <div className="text-27 font-semibold">{dappUrl}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Network />

        <div className="flex items-center gap-2 rounded-2xl border border-neutral-20 bg-neutral-2.5 px-4 py-3">
          <div className="flex-1">
            <div className="text-15 font-medium text-neutral-100">
              Set as default wallet
            </div>
            <div className="text-13 font-regular text-neutral-50">
              Launch Status (Desktop) when connecting to dApps with MetaMask or
              other wallets
            </div>
          </div>
          <Switch
            checked={defaultWallet}
            onCheckedChange={checked => {
              setDefaultWallet(checked)
              setReopen(true)
              window.location.reload()
            }}
          />
        </div>
      </div>
    </>
  )
}

export { Connected }
