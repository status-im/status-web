import { Link } from '@status-im/status-network/components'
import Image from 'next/image'

const REWARDS = ['GUSD', 'KARMA', 'SNT', 'LINEA']

const RewardsSection = () => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="flex -space-x-2">
        {REWARDS.map(reward => (
          <Image
            key={reward}
            src={`/tokens/${reward.toLowerCase()}.png`}
            alt={reward}
            width="22"
            height="22"
            className="size-5 rounded-full border border-neutral-10"
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
