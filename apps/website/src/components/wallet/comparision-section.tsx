import { Button, Counter, Tag, Text } from '@status-im/components'

import { useParalax } from '@/hooks/use-parallax'

import { ParalaxCircle } from './parallax-circle'

const ComparisionSection = () => {
  const { top, bottom } = useParalax({
    initialTop: -690,
  })

  return (
    <div className="relative">
      <div className="border-neutral-80/20 bg-white-100 relative grid grid-cols-4 border-t border-dashed mix-blend-normal">
        <div className="border-neutral-80/20 col-span-2 border-r border-dashed py-[160px] pl-10 pr-[60px]">
          <div className="flex h-full flex-col justify-between">
            <div className="inline-flex max-w-[646px] flex-col">
              <div className="inline-flex">
                <Tag label="Use case" size={24} />
              </div>
              <h2 className="pt-4 text-[40px] font-bold leading-[44px]">
                Alice has 50 DAI on both Ethereum Mainnet and Optimism and wants
                to send 100 DAI to Bob on Arbitrum.
              </h2>
            </div>

            <div className="border-neutral-80/20 mt-16 flex max-w-[341px] flex-col rounded-[20px] border border-dashed p-4 pt-4">
              <Text size={19} weight="semibold">
                Finally! Multi-chain done right!
              </Text>
              <div className="flex pt-1">
                <Text size={19}>
                  Interested in how Status’s send with auto routing and bridging
                  works and helps users?{' '}
                </Text>
              </div>
              <div className="inline-flex pt-1">
                <Button variant="outline">Read more</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-neutral-80/20  border-r border-dashed px-10 py-[160px]">
          <Text size={19} weight="semibold">
            Other wallets
          </Text>
          <div className="flex flex-col pt-3">
            {listOneData.map(item => (
              <Item key={item.count} {...item} />
            ))}
          </div>
        </div>
        <div className="px-10 py-[160px]">
          <Text size={19} weight="semibold">
            Status Wallet
          </Text>
          <div className="flex flex-col pt-3">
            {listTwoData.map(item => (
              <Item key={item.count} {...item} />
            ))}
          </div>
        </div>
        <ParalaxCircle initialTop={-600} />
      </div>
      <p
        style={{
          top: `${top}px`,
          bottom: `${bottom}px`,
          left: -40,
          // TODO: use font from design when it's ready
          fontFamily: 'Menlo',
        }}
        className="text-neutral-80/5 absolute whitespace-nowrap text-[240px] font-bold leading-[212px]"
      >
        eth:opt:arb:0xAgafhja
      </p>
    </div>
  )
}

export { ComparisionSection }

const listOneData = [
  {
    count: 1,
    label: 'Open dApp Browser',
  },
  {
    count: 2,
    label: 'Visit Bridge dApp',
  },
  {
    count: 3,
    label: 'Bridge DAI from Mainnet to Arbitrum',
  },
  {
    count: 4,
    label: 'Send DAI on Arbitrum',
  },
  {
    count: 5,
    label: 'Open dApp Browser',
  },
  {
    count: 6,
    label: 'Visit Bridge dApp',
  },
  {
    count: 7,
    label: 'Bridge DAI from Optimism to Arbitrum',
  },
  {
    count: 8,
    label: 'Send DAI on Arbitrum',
    noBorder: true,
  },
  {
    count: '😮‍💨',
    label: 'Is that it?',
    secondaryLabel: 'Did I use cheapest route and bridges?',
    noBorder: true,
  },
]

const listTwoData = [
  {
    count: 1,
    label: 'Select the token',
  },
  {
    count: 2,
    label: 'Select the amount',
  },
  {
    count: 3,
    label: 'Send',
    noBorder: true,
  },
  {
    count: '🎉',
    label: 'That’s it!',
    secondaryLabel: 'Lowest possible cost!',
    noBorder: true,
  },
]

const Item = (props: {
  count: string | number
  label: string
  secondaryLabel?: string
  noBorder?: boolean
}) => {
  const { count, label, secondaryLabel, noBorder } = props
  const isNumber = typeof count === 'number'
  return (
    <div
      className={`border-neutral-80/20 flex ${
        noBorder ? 'border-b-0' : 'border-b'
      } border-dashed py-3`}
    >
      {isNumber ? (
        <Counter value={count} type="outline" />
      ) : (
        <Text size={19}>{count}</Text>
      )}
      <div className="flex flex-col pl-[10px]">
        <Text size={19} weight={isNumber ? 'regular' : 'semibold'}>
          {label}
        </Text>
        {!isNumber && (
          <Text size={19} weight="regular">
            {secondaryLabel}
          </Text>
        )}
      </div>
    </div>
  )
}
