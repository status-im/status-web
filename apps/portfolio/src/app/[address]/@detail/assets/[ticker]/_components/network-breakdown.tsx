'use client'

import { CurrencyAmount } from '../../../../../_components/currency-amount'
import { NetworkLogo } from '../../../../../_components/network-logo'

import type { ApiOutput, NetworkType } from '@status-im/wallet/data'

type Props = {
  token: ApiOutput['assets']['token'] | ApiOutput['assets']['nativeToken']
}

export const NetworkBreakdown = (props: Props) => {
  const { token } = props

  return (
    <div className="rounded-16 border border-neutral-20 p-3 py-2">
      <div className="mb-1 text-13 font-regular text-neutral-50">
        Network breakdown
      </div>
      <div className="flex items-center gap-5">
        {Object.entries(token.assets).map(([network, asset]) => (
          <div key={network} className="flex items-center gap-1">
            <NetworkLogo name={network as NetworkType} size={12} />
            <CurrencyAmount
              value={asset.total_eur}
              className="text-13 font-medium text-neutral-100"
              format="standard"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
