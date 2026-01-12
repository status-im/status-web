'use client'

import { Link } from '@status-im/status-network/components'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const REWARDS = ['KARMA', 'LINEA', 'SNT', 'GUSD']

const RewardsSection = () => {
  const t = useTranslations()

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="flex size-[22px] min-w-[50px] items-center -space-x-1.5">
        {REWARDS.map(reward => (
          <Image
            key={reward}
            src={`/tokens/${reward.toLowerCase()}.png`}
            alt={reward}
            width="20"
            height="20"
          />
        ))}
      </div>
      <p className="text-15 text-neutral-60">
        {t('rewards.description')}
        <br />
        {t('rewards.audited_prefix')}{' '}
        <Link
          href="https://github.com/aragon/status-predeposit-vaults/blob/development/audit/report-aragon-pre-deposit-vaults.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple hover:text-purple-dark"
        >
          {t('rewards.audited_link')}
        </Link>
        . {t('rewards.deposit_confirmation')}{' '}
        <Link
          href="https://status.network/legal/status-network-pre-deposit-disclaimer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple hover:text-purple-dark"
        >
          {t('rewards.disclaimer')}
        </Link>
        .
      </p>
    </div>
  )
}

export { RewardsSection }
