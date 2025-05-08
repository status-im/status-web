import { Button } from '@status-im/components'
import { BuyIcon, ReceiveBlurIcon } from '@status-im/icons/20'

import { BuyCryptoDrawer } from './buy-crypto-drawer'
import { ReceiveCryptoDrawer } from './receive-crypto-drawer'

export function ActionBar() {
  return (
    <div className="sticky bottom-0 isolate z-10 backdrop-blur-lg">
      <div className="flex h-12 items-center justify-center gap-2 border-t border-neutral-80/5 bg-blur-white/70 p-2">
        <BuyCryptoDrawer>
          <Button size="32" variant="ghost" iconBefore={<BuyIcon />}>
            Buy
          </Button>
        </BuyCryptoDrawer>
        <ReceiveCryptoDrawer>
          <Button size="32" variant="ghost" iconBefore={<ReceiveBlurIcon />}>
            Receive
          </Button>
        </ReceiveCryptoDrawer>
      </div>
    </div>
  )
}
