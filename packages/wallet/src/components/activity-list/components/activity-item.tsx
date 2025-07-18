import { ContextTag } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { getTransactionHash } from '../../../utils/transaction-hash'
import { CurrencyAmount } from '../../currency-amount'
import { NetworkLogo } from '../../network-logo'
import { RelativeDate } from '../../relative-date'
import { shortenAddress } from '../../shorten-address'
import { formatTokenAmount } from '../../token-amount'
import { ActivityDirection } from './activity-direction'
import { ActivityStatus } from './activity-status'
import { ActivityTokenLogo } from './activity-token-logo'

import type { Activity } from '@status-im/wallet/data'

type ActivityItemProps = {
  activity: Activity
  userAddress: string
}

function getTokenActivityLabel(activity: Activity): string {
  if (activity.category === 'erc721') {
    return '1 NFT'
  }

  if (
    activity.category === 'erc1155' &&
    Array.isArray(activity.erc1155Metadata) &&
    activity.erc1155Metadata.length > 0
  ) {
    const total = activity.erc1155Metadata.reduce(
      (sum, meta) => sum + parseInt(meta.value, 16),
      0,
    )
    // ERC1155 can have multiple NFTs or FTs, so we show the total count
    return `${total} Token${total > 1 ? 's' : ''}`
  }

  return '1 Asset'
}

const ActivityItem = (props: ActivityItemProps) => {
  const { activity, userAddress } = props

  const transactionHash = getTransactionHash(activity.hash)
  const outgoingTransaction =
    activity.from.toLowerCase() === userAddress.toLowerCase()
  const assetSymbol =
    activity.asset || (activity.category === 'external' ? 'ETH' : null)
  const eurValue = Number(activity.eurRate) * Number(activity.value)

  return (
    <a
      href={`https://etherscan.io/tx/${transactionHash}`}
      target="_blank"
      className="grid grid-cols-[2fr_1fr_1fr] gap-4 rounded-12 p-3 transition-colors focus-within:bg-neutral-5 hover:bg-neutral-5"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ActivityTokenLogo
            symbol={assetSymbol || 'ETH'}
            address={activity.rawContract?.address ?? ''}
          />
          <div className="absolute bottom-[-4px] right-[-4px] size-[18px] rounded-full border border-white-100">
            <NetworkLogo name={activity.network} size={16} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-15 font-600 sm:max-w-full">
            <ActivityDirection
              direction={outgoingTransaction ? 'sent' : 'received'}
            />
            <RelativeDate
              timestamp={activity.metadata.blockTimestamp}
              className="text-13 font-400 text-neutral-40"
            />
          </div>
          <div className="flex items-end text-13 font-400 text-neutral-50">
            <ContextTag type="label" size="24">
              {shortenAddress(
                outgoingTransaction ? activity.to : activity.from,
              )}
            </ContextTag>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center">
        {assetSymbol ? (
          <div className="flex flex-col items-end gap-1 truncate">
            <ContextTag type="label" size="24">
              {`${
                outgoingTransaction ? '-' : '+'
              } ${formatTokenAmount(activity.value, 'precise')} ${assetSymbol}`}
            </ContextTag>
            {eurValue > 0 && (
              <div
                className={cx(
                  'flex items-center gap-1 text-13 font-500',
                  outgoingTransaction ? 'text-danger-50' : 'text-success-50',
                )}
              >
                {outgoingTransaction ? '-' : '+'}
                <CurrencyAmount
                  value={eurValue}
                  format="standard"
                  className="text-13 font-500"
                />
              </div>
            )}
          </div>
        ) : (
          <ContextTag type="label" size="24">
            {getTokenActivityLabel(activity)}
          </ContextTag>
        )}
      </div>
      <div className="flex items-center justify-end gap-1 text-13 font-400 text-neutral-50">
        <ActivityStatus status={activity.status} />
        <ExternalIcon className="text-neutral-50" />
      </div>
    </a>
  )
}

export { ActivityItem }
