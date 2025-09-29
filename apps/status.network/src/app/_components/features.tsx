import { BulletIcon, ExternalIcon } from '@status-im/icons/20'
import { FEATURES } from '~/config/routes'
import { AnimatedFrames } from './animated-frames'
import { ButtonLink } from './button-link'
import { Divider } from './divider'

const Features = () => {
  return (
    <section className="relative w-full scroll-mt-16" id="features">
      <div className="flex flex-col lg:flex-row">
        <div className="bg-[#1B273D05] lg:sticky lg:top-16 lg:h-[calc(100vh-6rem)] lg:max-w-[50%] lg:flex-shrink-0">
          <div className="px-4 py-20 lg:p-12">
            <p className="mb-6 inline-block text-13 font-500 text-purple">
              02{' '}
              <span className="inline-block h-2 w-px bg-purple-transparent" />{' '}
              WHY STATUS NETWORK?
            </p>
            <h2 className="text-40 font-600 lg:text-64">
              Power to the community
            </h2>
          </div>
        </div>
        <div className="block lg:hidden">
          <Divider />
        </div>

        <div className="w-full border-neutral-80/10 lg:border-l lg:py-12">
          <div className="space-y-12">
            <div className="flex flex-col gap-4 px-4 pt-12 text-19 lg:px-12 lg:py-0 xl:max-w-[540px] xl:pr-0">
              <h3 className="text-27 font-600 lg:mb-1 lg:text-40">
                Sustainable public funding
              </h3>
              <p>
                Status Network takes a radical step beyond short-term
                incentives. Powered by native yields and fees, its public app
                funding pool is governed by the community, ensuring a continuous
                allocation of capital for onchain builders.
              </p>
              <ol className="mb-4 space-y-4">
                <li className="flex gap-3 lg:gap-4">
                  <div className="mt-1 flex h-[22px] w-5 flex-shrink-0 items-center justify-center rounded-8 border border-neutral-20 text-13 font-500">
                    1
                  </div>
                  <p>
                    Users bridge yield-bearing assets to Status Network and
                    increase the yield redirected to the funding pool.
                  </p>
                </li>
                <li className="flex gap-3 lg:gap-4">
                  <div className="mt-1 flex h-[22px] w-5 flex-shrink-0 items-center justify-center rounded-8 border border-neutral-20 text-13 font-500">
                    2
                  </div>
                  <div>
                    <p className="mb-4">
                      Apps and games apply for an allocation from the pool. The
                      community votes on allocations using Karma, a
                      non-transferrable governance token earned by contributing
                      positively to the network:
                    </p>
                    <div className="ml-6 list-disc space-y-2 marker:text-neutral-50">
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" /> Staking SNT
                      </p>
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" />
                        Bridging yield-bearing tokens
                      </p>
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" />
                        Using apps
                      </p>
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" />
                        Paying premium gas
                      </p>
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" />
                        Making direct donations to the funding pool
                      </p>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3 lg:gap-4">
                  <div className="mt-1 flex h-[22px] w-5 flex-shrink-0 items-center justify-center rounded-8 border border-neutral-20 text-13 font-500">
                    3
                  </div>
                  <p>
                    Every funded project onboards new users, driving additional
                    asset deposits and token swaps - generating more yield and
                    fees to be allocated in the funding pool.
                  </p>
                </li>
              </ol>
              <ButtonLink
                href={FEATURES.sustainablePublicFunding.href}
                variant="white"
              >
                {FEATURES.sustainablePublicFunding.name}
              </ButtonLink>
              <AnimatedFrames
                images={[
                  '/features/pig-1.png',
                  '/features/pig-2.png',
                  '/features/pig-3.png',
                ]}
                className="mt-6"
                width={112}
                height={112}
                alt="Sustainable public funding"
              />
            </div>

            <Divider variant="left" />

            <div className="flex flex-col gap-4 px-4 text-19 lg:px-12 xl:max-w-[540px]">
              <h3 className="text-27 font-600 lg:mb-1 lg:text-40">
                Gasless transactions
              </h3>
              <p>
                On Status Network, anyone can experience free transactions! With
                the L2 operating costs covered by native yields and fees, no
                need to bridge gas to use an app.
              </p>
              <p className="mb-4">
                Apps and games developers can offer frictionless onboarding for
                their users at scale.
              </p>
              <ButtonLink
                href={FEATURES.gaslessTransactions.href}
                variant="white"
              >
                {FEATURES.gaslessTransactions.name}
              </ButtonLink>
              <AnimatedFrames
                images={[
                  '/features/unicorn-1.png',
                  '/features/unicorn-2.png',
                  '/features/unicorn-3.png',
                ]}
                className="mt-6"
                width={112}
                height={112}
                delay={300}
                alt="Gasless Transactions"
              />
            </div>

            <Divider variant="left" />

            <div className="flex flex-col gap-4 px-4 text-19 lg:px-12 xl:max-w-[540px]">
              <h3 className="text-27 font-600 lg:mb-1 lg:text-40">
                Built for performance, secured by Ethereum
              </h3>
              <p className="mb-4">
                Leverage Ethereum&apos;s security with Linea&apos;s cutting-edge
                zkEVM rollup technology for high-speed transactions. Perfect for
                gaming, social, iGaming, and high-throughput applications.
              </p>
              <ButtonLink
                variant="white"
                href={FEATURES.performance.href}
                icon={<ExternalIcon className="text-neutral-50" />}
              >
                {FEATURES.performance.name}
              </ButtonLink>
              <AnimatedFrames
                images={['/features/kite-1.png', '/features/kite-2.png']}
                className="mt-6"
                width={112}
                height={112}
                delay={500}
                alt="Built for performance, secured by Ethereum"
              />
            </div>

            <Divider variant="left" />

            <div className="flex flex-col gap-4 px-4 pb-12 text-19 lg:px-12 lg:pb-0 xl:max-w-[540px]">
              <h3 className="text-27 font-600 lg:mb-1 lg:text-40">
                Geared for decentralization
              </h3>
              <p className="mb-4">
                Built on the core values of Status and the IFT ecosystem, Status
                Network is designed to become a truly decentralised L2. The
                endgame is to provide a censorship-resistant environment where
                communities can thrive without central points of control.
              </p>
              <ButtonLink
                variant="white"
                href="https://free.technology"
                icon={<ExternalIcon className="text-neutral-50" />}
              >
                Learn more
              </ButtonLink>

              <AnimatedFrames
                images={['/features/planet-1.png', '/features/planet-2.png']}
                className="mt-6"
                width={112}
                height={112}
                delay={700}
                alt="Geared for decentralization"
              />
            </div>
          </div>
        </div>
      </div>
      <Divider hasMiddleCircle />
    </section>
  )
}

export { Features }
