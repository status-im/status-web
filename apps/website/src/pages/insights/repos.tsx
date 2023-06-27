import { Shadow, Text } from '@status-im/components'
import { OpenIcon, UnlockedIcon } from '@status-im/icons'

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
    name: 'nim-waku',
    description: 'a free (libre) open source, mobile OS for Ethereum.',
    issues: 10,
    stars: 5,
  },
  {
    name: 'go-waku',
    description: 'a free (libre) open source, mobile OS for Ethereum.',
    issues: 10,
    stars: 5,
  },
  {
    name: 'js-waku',
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
          <Shadow key={repo.name}>
            <Link
              href={`https://github.com/status-im/${repo.name}`}
              className="flex h-[124px] flex-col justify-between rounded-2xl border border-neutral-10 px-4 py-3 transition-colors duration-200 hover:border-neutral-40"
            >
              <div className="flex flex-col">
                <Text size={15} weight="semibold">
                  {repo.name}
                </Text>
                <Text size={15} color="$neutral-50">
                  {repo.description}
                </Text>
              </div>

              <div className="flex gap-3 pt-4">
                <div className="flex items-center">
                  <div className="pr-1">
                    <UnlockedIcon size={12} color="$neutral-50" />
                  </div>
                  <Text size={13} weight="medium" color="$neutral-100">
                    Public
                  </Text>
                </div>
                <div className="flex items-center">
                  <div className="pr-1">
                    <OpenIcon size={12} color="$neutral-50" />
                  </div>
                  <Text size={13} weight="medium" color="$neutral-100">
                    42 issues
                  </Text>
                </div>
                <div className="flex items-center">
                  <div className="pr-1">
                    <OpenIcon size={12} color="$neutral-50" />
                  </div>
                  <Text size={13} weight="medium" color="$neutral-100">
                    32
                  </Text>
                </div>
              </div>
            </Link>
          </Shadow>
        ))}
      </div>
    </div>
  )
}

ReposPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export default ReposPage
