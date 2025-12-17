import { Link } from '@status-im/status-network/components'
import Image from 'next/image'

const REWARDS = ['KARMA', 'LINEA', 'SNT', 'GUSD']

const RewardsSection = () => {
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
        Rewards in KARMA, SNT, LINEA and points from Generic Protocol and native
        apps. Funds will be unlocked at mainnet launch.
        <br />
        All contracts have been{' '}
        <Link
          href="https://github.com/aragon/status-predeposit-vaults/blob/development/audit/report-aragon-pre-deposit-vaults.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple hover:text-purple-dark"
        >
          audited
        </Link>
        .
      </p>
    </div>
  )
}

export { RewardsSection }
