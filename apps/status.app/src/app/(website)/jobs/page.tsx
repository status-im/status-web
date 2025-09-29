import { Button, Tag, Text } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/16'
import { ArrowDownIcon, ArrowRightIcon } from '@status-im/icons/20'
import Link from 'next/link'
import { match } from 'ts-pattern'

import { groupBy } from '~/utils/group-by'
import { Metadata } from '~app/_metadata'
import { Image } from '~components/assets'
import { Body } from '~components/body'
import { FeatureList } from '~website/_components/feature-list'
import { ParallaxCircle } from '~website/_components/parallax-circle'
import { getLogosJobs, getStatusJobs } from '~website/_lib/greenhouse'

import type { ImageId } from '~components/assets'
import type { FeatureListProps } from '~website/_components/feature-list'

export const revalidate = 3600 // 1 hour

export const metadata = Metadata({
  title: 'Jobs',
  description: 'Join us in our mission.',
})

export default async function JobsPage() {
  const [statusJobs, logosJobs] = await Promise.all([
    getStatusJobs(),
    getLogosJobs(),
  ])

  const statusJobsByDepartment = groupBy(
    statusJobs?.jobs ?? [],
    job => job.departments[0].name,
    {}
  )
  const networkJobsByDepartment = groupBy(
    logosJobs?.jobs ?? [],
    job => job.departments[0].name,
    {}
  )
  const total = statusJobs.meta?.total ?? 0

  return (
    <Body>
      <div className="container relative flex flex-col items-start pt-16 xl:pt-40">
        <div className="relative mb-4">
          <Tag size="32" label="Jobs" />
        </div>
        <h1 className="relative z-20 mb-6 text-48 font-bold xl:mb-8 xl:text-88">
          Join us in
          <br />
          our mission
        </h1>

        {Object.keys(statusJobsByDepartment).length > 0 && (
          <div
            className="z-10 flex w-full max-w-[462px] flex-col justify-between gap-3 rounded-16 border border-dashed border-neutral-80/20 bg-white-20 p-3 2md:flex-row 2md:gap-10 xl:items-center xl:p-2 xl:pl-3"
            data-background="blur"
          >
            <div className="flex flex-col">
              <Text size={13} weight="semibold">
                We’re hiring!
              </Text>
              <Text size={13}>
                {total} remote opening{total !== 1 && 's'}
              </Text>
            </div>
            <Button
              variant="outline"
              iconAfter={<ArrowDownIcon />}
              href="/jobs#open-roles"
            >
              View opening{total === 1 ? '' : 's'}
            </Button>
          </div>
        )}

        <ParallaxCircle
          color="purple"
          className="left-[-290px] right-auto top-[-366px] xl:left-auto xl:right-0 xl:top-[-366px]"
        />
        <ParallaxCircle
          color="orange"
          className="hidden xl:left-[81px] xl:top-[112px] xl:block"
        />
      </div>

      {/* PHOTOS */}
      <div className="mx-auto mb-12 mt-8 max-w-[1224px] px-5 2md:mb-0 2md:mt-[-72px] 2md:px-0">
        <div className="relative z-[2] 2md:mx-[-18%]">
          <Image
            id="Jobs/Top Section/Jobs_01:5113:2971"
            alt=""
            className="hidden 2md:block"
            priority
          />
          <Image
            id="Jobs/Top Section/Jobs_01_Mobile:1745:1867"
            alt=""
            className="2md:hidden"
          />
        </div>
      </div>

      <section className="relative border-b border-dashed border-neutral-80/20 pb-24 xl:pb-40">
        <ParallaxCircle
          color="yellow"
          className="left-[-170px] right-auto top-[-436px] xl:left-auto xl:right-[-81px] xl:top-[-112px]"
        />
        <ParallaxCircle
          color="pink"
          className="bottom-[-336px] left-[-170px] xl:bottom-[-463px] xl:left-[-30px]"
        />
        <div className="relative mx-auto max-w-[740px] px-5">
          <div className="mb-7">
            <Text size={19}>
              Want to join an organisation dedicated to building a 100% open
              source fully decentralised platform that aims to uphold human
              rights? At Status, we’re always on the lookout for great people
              who align with our principles and aren’t shy about embracing their
              authenticity.
            </Text>
          </div>
          <div className="mb-7">
            <Text size={19}>
              We have created an environment that allows our core contributors
              to work with freedom and flexibility. We believe working this way
              builds trust and encourages each individual to find a favorable
              work/life balance.
            </Text>
          </div>
          <div className="mb-7">
            <Text size={19}>
              All positions are remote. You may work from any location (as long
              as you can be online every day in your team’s crossover hours) and
              choose your working times. We care about getting the job done, not
              about traditional corporate models with fixed office hours and
              locations.
            </Text>
          </div>
          <div className="mb-7">
            <Text size={19}>
              We regularly survey core contributors to gather insights on their
              satisfaction with Status, and the most common responses of why
              they enjoy working with us are: our mission, values, flexibility,
              friendly environment, non-corporate culture, and our
              entrepreneurial spirit.
            </Text>
          </div>
          <Text size={19}>
            If working at Status resonates with you, check out our open roles
            below.
          </Text>
        </div>
      </section>

      <div className="relative border-b border-dashed border-neutral-80/20 bg-white-100 py-24 xl:py-40">
        <div className="container mb-12 xl:mb-20">
          <h2 className="text-40 font-bold xl:text-64">
            Status supports
            <br />
            its contributors
          </h2>
        </div>
        <FeatureList list={PERKS} />
        <ParallaxCircle
          color="blue"
          className="bottom-[-336px] left-[24px] right-auto xl:bottom-[-338px] xl:left-auto xl:right-[44px]"
        />
      </div>

      <div id="open-roles" className="relative bg-white-100">
        <div className="container py-24 xl:py-40">
          <div className="mb-12 xl:mb-20">
            <h2 className="text-40 font-bold xl:text-64">
              <span className="relative">
                Open roles
                <Image
                  id="Jobs/Scribbles and Notes/Scribble_01:536:161"
                  alt=""
                  aria-hidden
                  className="absolute -top-6 left-[calc(100%+24px)] hidden w-[176px] md:block xl:-top-3"
                />
                <Image
                  id="Jobs/Scribbles and Notes/Scribble_01_Mobile:292:267"
                  alt=""
                  aria-hidden
                  className="absolute left-[calc(100%+30px)] top-2 md:hidden"
                  width={95}
                  height={88}
                />
              </span>
            </h2>
          </div>

          <div className="grid gap-12 xl:gap-16">
            {/* JOB GROUPS */}
            {Object.keys(statusJobsByDepartment).map(department => (
              <div
                key={department}
                className="border-b border-dashed border-neutral-80/20"
              >
                <div>
                  <h3 className="mb-3 text-27 font-semibold">{department}</h3>
                </div>

                <div className="divide-y divide-dashed divide-neutral-80/20">
                  {statusJobsByDepartment[department].map(job => (
                    // TODO: discuss hover state
                    <Link
                      href={`/jobs/${job.id}`}
                      key={job.id}
                      className="flex items-center justify-between gap-6 py-5"
                    >
                      <div className="flex flex-1 flex-col justify-between xl:flex-row">
                        <Text size={19} weight="semibold">
                          {job.title}
                        </Text>
                        <Text size={19}>Remote</Text>
                      </div>
                      <Button
                        variant="outline"
                        icon={<ArrowRightIcon />}
                        aria-label="View job"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(statusJobsByDepartment).length === 0 ? (
              <div className="-mx-4 flex flex-row items-center gap-3 rounded-12 border border-dashed border-neutral-80/20 px-4 py-2">
                <Image
                  id="Jobs/Icons/Icon Section/02_Unlimited_Time_Off:145:144"
                  alt=""
                  height={54}
                  width={54}
                />
                <div className="flex flex-1 flex-row items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <Text size={15} weight="semibold">
                      No open roles
                      {/* {Object.keys(statusJobsByDepartment).length > 0
                      ? 'Nothing for you?'
                      : 'No open roles'} */}
                    </Text>
                    {/* <Text size={15}>Don’t be shy, self-apply.</Text> */}
                  </div>
                  <div className="">
                    {/* <Button
                    variant="outline"
                    size={40}
                    icon={<ArrowRightIcon  />}
                  /> */}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* TODO FIX TEXTURE */}
      {Object.keys(networkJobsByDepartment).length > 0 && (
        <div className="rounded-[40px] bg-[#F5F6FD]">
          <div className="container py-24 xl:py-40">
            <div className="mb-20">
              <h3 className="text-40 font-semibold">
                Open roles
                <br />
                in our network
              </h3>
            </div>
            <div className="grid gap-12">
              {Object.keys(networkJobsByDepartment).map(department => (
                <div key={department} className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <Image
                      id={match<string, ImageId>(department)
                        .with('Logos', () => 'Networks/Logos:48:48')
                        .with('Codex', () => 'Networks/Codex:48:48')
                        .with('Nimbus', () => 'Networks/Nimbus:48:48')
                        .with('Vac', () => 'Networks/Vac:48:48')
                        .with('Waku', () => 'Networks/Waku:48:48')
                        .with('Nomos', () => 'Networks/Nomos:48:48')
                        .otherwise(() => 'Networks/Logos:48:48')}
                      alt={`${department} logo` as ''}
                      width={24}
                      height={24}
                    />
                    <Text size={19} weight="semibold">
                      {department}
                    </Text>
                  </div>
                  {networkJobsByDepartment[department].map(job => (
                    <Link
                      key={job.id}
                      href={job.absolute_url}
                      className="group flex items-center"
                    >
                      <Text size={15} weight="medium">
                        {job.title}
                      </Text>
                      <ExternalIcon className="transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[-2px]" />
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Body>
  )
}

const PERKS: FeatureListProps['list'] = [
  {
    title: 'Fully remote',
    description:
      'Work autonomously from wherever you want, unleash your full potential.',
    icon: 'Jobs/Icons/Icon Section/01_Fully_Remote:144:144',
  },
  {
    title: 'Unlimited time-off',
    description:
      'Take time off you need when you need it and prioritise your well-being.',
    icon: 'Jobs/Icons/Icon Section/02_Unlimited_Time_Off:145:144',
  },
  {
    title: 'Crypto pay',
    description:
      'Get paid in all fiat, or all crypto, or a split between the two.',
    icon: 'Jobs/Icons/Icon Section/03_Crypto_Pay:145:144',
  },
  {
    title: 'Hardware provided',
    description: 'Need a laptop? Status will cover you.',
    icon: 'Jobs/Icons/Icon Section/04_Hardware_Provided:144:144',
  },
  {
    title: 'Coworking budget',
    description: 'Get up to $270 coworking allowance.',
    icon: 'Jobs/Icons/Icon Section/05_Coworking_Budget:145:144',
  },
  {
    title: 'Paid offsites',
    description: 'Come work with and meet the team.',
    icon: 'Jobs/Icons/Icon Section/06_Paid_Offsites:145:144',
  },
  {
    title: 'SNT allocation',
    description:
      'Get an allocation of SNT to further incentivise your contributions.',
    icon: 'Jobs/Icons/Icon Section/07_SNT_Bonus:144:144',
  },
  {
    title: 'Referral fee',
    description:
      'Receive $5000 SNT referral fee for bringing your friends onboard.',
    icon: 'Jobs/Icons/Icon Section/08_Referral_Fee:145:144',
  },
  {
    title: 'Mental calibration',
    description:
      'Enjoy a free Headspace subscription to focus and ease your mind.',
    icon: 'Jobs/Icons/Icon Section/09_Mental_Calibration:145:144',
  },
]
