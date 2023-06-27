import { Text } from '@felicio/components'

import { Link } from '@/components/link'
import { InsightsLayout } from '@/layouts/insights-layout'

import type { Page } from 'next'

const repos = [
  {
    name: 'status-web',
    description: 'a free (libre) open source, mobile OS for Ethereum.',
    issues: 10,
    stars: 5,
  },
  {
    name: 'status-mobile',
    description: 'a free (libre) open source, mobile OS for Ethereum.',
    issues: 10,
    stars: 5,
  },
  {
    name: 'status-desktop',
    description: 'a free (libre) open source, mobile OS for Ethereum.',
    issues: 10,
    stars: 5,
  },
  {
    name: 'status-go',
    description: 'a free (libre) open source, mobile OS for Ethereum.',
    issues: 10,
    stars: 5,
  },
  {
    name: 'nimbus-eth2',
    description: 'a free (libre) open source, mobile OS for Ethereum.',
    issues: 10,
    stars: 5,
  },
  {
    name: 'help.status.im',
    description: 'help.status.im',
    issues: 10,
    stars: 5,
  },
]

const ReposPage: Page = () => {
  return (
    <div className="p-10">
      <div className="mb-6">
        <Text size={27} weight="semibold">
          Repos
        </Text>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {repos.map(repo => (
          <Link
            key={repo.name}
            href={`https://github.com/status-im/${repo.name}`}
            className="flex h-[124px] flex-col rounded-2xl border border-neutral-10 px-4 py-3 transition-colors duration-200 hover:border-neutral-40"
          >
            <Text size={15} weight="semibold">
              {repo.name}
            </Text>
            <Text size={15} color="$neutral-50">
              {repo.description}
            </Text>

            <div className="flex gap-3 pt-4">
              <Text size={13} weight="medium" color="$neutral-50">
                Public
              </Text>
              <Text size={13} weight="medium" color="$neutral-50">
                42 Issues
              </Text>
              <Text size={13} weight="medium" color="$neutral-50">
                32
              </Text>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

ReposPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export default ReposPage
