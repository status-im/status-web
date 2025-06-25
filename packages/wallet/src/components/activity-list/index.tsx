'use client'

import { ContextTag } from '@status-im/components'
import { CheckIcon, NegativeStateIcon, PendingIcon } from '@status-im/icons/12'
import { ReceiveIcon, SendIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { formatRelative } from 'date-fns'
import { match } from 'ts-pattern'

import erc20TokenList from '../../constants/erc20.json'
import { NetworkLogo } from '../network-logo'
import { shortenAddress } from '../shorten-address'

import type { ApiOutput } from '../../data'

const fromAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'

type Activity = ApiOutput['activities']['activities']['activities'][0]

type Props = {
  activities: Activity[]
}

const ActivityList = (props: Props) => {
  const { activities } = props

  return (
    <div className="pb-10">
      <div className="flex min-h-[calc(100svh-362px)] w-full overflow-auto 2xl:hidden">
        <div className="w-full">
          {activities.map(activity => {
            return <ActivityItem key={activity.uniqueId} activity={activity} />
          })}
        </div>
      </div>
    </div>
  )
}

type ActivityItemProps = {
  activity: Activity
}

const ActivityItem = (props: ActivityItemProps) => {
  const { activity } = props

  return (
    <div className="flex w-full items-center justify-between rounded-12 px-3 py-2 transition-colors focus-within:bg-neutral-5 hover:bg-neutral-5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <TokenLogo
            symbol={activity.asset}
            address={activity.rawContract?.address ?? ''}
          />
          <div className="absolute bottom-[-4px] right-[-4px] size-[18px] rounded-full border border-white-100">
            <NetworkLogo name={activity.network} size={16} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-15 font-600 sm:max-w-full">
            <ActivityDirection
              direction={activity.from === fromAddress ? 'sent' : 'received'}
            />
            <span className="text-13 font-400 text-neutral-40">
              {formatRelative(
                new Date(activity.metadata.blockTimestamp),
                new Date(),
              )}
            </span>
          </div>
          <div className="flex items-end text-13 font-400 text-neutral-50">
            <ContextTag type="label" size="24">
              {shortenAddress(
                activity.from === fromAddress ? activity.to : activity.from,
              )}
            </ContextTag>
          </div>
        </div>
      </div>
      <div className="flex min-w-[250px] flex-col items-end self-end">
        {activity.asset ? (
          <ContextTag type="label" size="24">
            {`${activity.value} ${activity.asset}`}
          </ContextTag>
        ) : (
          <ContextTag type="label" size="24">
            NFT
          </ContextTag>
        )}
      </div>
      <div className="flex self-end text-13 font-400 text-neutral-50">
        <ActivityStatus status={activity.status} />
      </div>
    </div>
  )
}

type ActivityStatusProps = {
  status: Activity['status']
}

const ActivityStatus = (props: ActivityStatusProps) => {
  const { status } = props

  const baseClass =
    'flex items-center gap-1 rounded-20 border pl-[5px] pr-[8px] py-[3px] h-6'

  return match(status)
    .with('success', () => {
      return (
        <div className={cx(baseClass, 'border-success-50 bg-success-50/10')}>
          <CheckIcon className="text-success-50" />
          <div className="text-13 font-500 text-success-50">Success</div>
        </div>
      )
    })
    .with('failed', () => {
      return (
        <div className={cx(baseClass, 'border-danger-50/20 bg-danger-50/10')}>
          <NegativeStateIcon className="text-danger-50" />
          <div className="text-13 font-500 text-danger-50">Failed</div>
        </div>
      )
    })
    .with('pending', () => {
      return (
        <div className={cx(baseClass, 'border-neutral-20 bg-neutral-10')}>
          <PendingIcon className="text-neutral-40" />
          <div className="flex text-13 font-400 text-neutral-40">Pending</div>
        </div>
      )
    })
    .with('unknown', () => {
      return (
        <div className={cx(baseClass, 'border-neutral-20 bg-neutral-10')}>
          <div className="flex text-13 font-400 text-neutral-50">Unknown</div>
        </div>
      )
    })
    .exhaustive()
}

type TokenLogoProps = {
  symbol: string
  address: string
}

const TokenLogo = (props: TokenLogoProps) => {
  const { symbol, address } = props

  const getTokenLogo = (symbol: string, contractAddress?: string) => {
    const token = erc20TokenList.tokens.find(
      token =>
        token.symbol === symbol ||
        (contractAddress &&
          token.address.toLowerCase() === contractAddress.toLowerCase()),
    )

    return token?.logoURI || ''
  }

  return (
    <img
      className="size-8 flex-shrink-0 rounded-full bg-neutral-10"
      alt={symbol}
      src={getTokenLogo(symbol, address)}
    />
  )
}

type ActivityDirectionProps = {
  direction: 'sent' | 'received'
}

const ActivityDirection = (props: ActivityDirectionProps) => {
  const { direction } = props
  const Icon = direction === 'sent' ? SendIcon : ReceiveIcon
  const text = direction === 'sent' ? 'Sent' : 'Received'

  return (
    <div className="flex items-center gap-1 text-15 font-600 text-neutral-100">
      <Icon className="text-neutral-50" />
      {text}
    </div>
  )
}

export { ActivityList }
