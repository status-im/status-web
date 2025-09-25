'use client'

import { ExternalIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import Image from 'next/image'

import { PercentIcon, PlusIcon } from './icons'

type Props = {
  name: string
  apy: string
  rewards: Array<string>
  icon: string
  onDeposit: () => void
}

const VaultCard = (props: Props) => {
  const { name, apy, rewards, icon, onDeposit } = props
  const apyValue = apy.endsWith('%') ? apy.slice(0, -1) : apy
  const rewardsLine = rewards.join(', ')

  return (
    <div className="size-full rounded-32 border border-neutral-20 bg-white-100 p-8 shadow-1">
      {/* header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              className="flex size-10 items-center justify-center rounded-full bg-purple"
              src={`/vaults/${icon}.png`}
              alt={icon}
              width="56"
              height="56"
            />

            <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-neutral-5 bg-white-100">
              <Image
                src="/tokens/KARMA.png"
                alt="KARMA"
                width="16"
                height="16"
              />
            </div>
          </div>
        </div>
      </div>

      {/* meta */}
      <ul className="my-6 space-y-4">
        <li className="text-27 font-600">{name}</li>
        <li className="flex items-center gap-2 text-[15px]">
          <span className="text-neutral-50">
            <PercentIcon />
          </span>
          <span>{apyValue} APY</span>
        </li>
        <li className="flex items-center gap-2 text-[15px]">
          <span className="text-neutral-50">
            <PlusIcon />
          </span>
          <span>{rewardsLine}</span>
        </li>
      </ul>

      {/* cta */}
      <Button size="32" onClick={onDeposit}>
        Deposit
        <ExternalIcon className="text-blur-white/70" />
      </Button>
    </div>
  )
}

export { VaultCard }
