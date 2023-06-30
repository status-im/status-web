import { useRef } from 'react'

// import codexImage from '@assets/jobs/codex.png'
import logosImage from '@assets/jobs/logos.png'
// import nimbusImage from '@assets/jobs/nimbus.png'
// import vacImage from '@assets/jobs/vac.png'
// import wakuImage from '@assets/jobs/waku.png'
import { Button, Tag, Text } from '@status-im/components'
import { ArrowDownIcon, ArrowRightIcon, ExternalIcon } from '@status-im/icons'
import Image from 'next/image'
import Link from 'next/link'

import { FeatureList } from '@/components/feature-list'
import { illustrations } from '@/config/illustrations'
import { AppLayout, Content } from '@/layouts/app-layout'

import type { Page } from 'next'

// TODO FIX PHOTOS
// TODO FIX FEATURE LIST
// TODO ADD CIRCLES
// TODO CONNECT TO GREENHOUSE API (https://developers.greenhouse.io/job-board.html#retrieve-job-board)

const OPEN_JOBS = 82

const JobsPage: Page = () => {
  const openRolesRef = useRef<HTMLDivElement>(null)

  const handleScrollToOpenings = () => {
    openRolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Content>
      <div className="container flex flex-col items-start pb-6 pt-16 lg:pb-20 lg:pt-40">
        <div className="mb-4">
          <Tag size={32} label="Jobs" />
        </div>
        <h1 className="mb-6 text-48 lg:mb-8 lg:text-88">
          Join the
          <br />
          decentralized
          <br />
          movement
        </h1>

        <div className="flex w-full max-w-[462px] flex-col justify-between gap-3 rounded-2xl border border-dashed border-neutral-80/20 p-3 md:flex-row md:gap-10 lg:items-center lg:p-2 lg:pl-3">
          <div className="flex flex-col">
            <Text size={13} weight="semibold">
              We’re hiring!
            </Text>
            <Text size={13}>{OPEN_JOBS} remote openings</Text>
          </div>
          <Button
            variant="outline"
            iconAfter={<ArrowDownIcon size={20} />}
            onPress={handleScrollToOpenings}
          >
            View openings
          </Button>
        </div>
      </div>

      {/* PHOTOS */}
      <div className="container grid grid-cols-2 gap-4 pb-12 pt-6 lg:pb-20 lg:pt-10">
        <img
          src="https://images.pexels.com/photos/16972528/pexels-photo-16972528/free-photo-of-sea-flight-bird-beach.jpeg?auto=compress&cs=tinysrgb&w=750&h=750&dpr=2"
          className="aspect-square rounded-3xl object-cover"
        />
        <div className="grid grid-rows-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.pexels.com/photos/17162015/pexels-photo-17162015/free-photo-of-street-field-school-park.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="aspect-square rounded-3xl object-cover"
            />
            <img
              src="https://images.pexels.com/photos/17162015/pexels-photo-17162015/free-photo-of-street-field-school-park.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="aspect-square rounded-3xl object-cover"
            />
          </div>
          <img
            src="https://images.pexels.com/photos/17162015/pexels-photo-17162015/free-photo-of-street-field-school-park.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            className="aspect-[2.060] rounded-3xl object-cover"
          />
        </div>
      </div>

      <section className="border-b border-dashed border-neutral-80/20 pb-24 pt-12 lg:pb-40 lg:pt-20">
        <div className="mx-auto max-w-[740px] px-5">
          <Text size={19}>
            Status strives to develop open source software that can be used as a
            secure communication tool that upholds human rights. We are building
            the tools and infrastructure for the advancement of a secure,
            private, and open web3. Our core software, Status, is an open
            source, Ethereum-based software that gives users the power to chat,
            transact, and access a revolutionary world of DApps on the
            decentralized web. With the high level goals of preserving the right
            to privacy, protecting messages from third parties, and safely
            sending, storing and receiving cryptocurrencies with you being the
            only one who holds the keys to your funds, Status is providing the
            tools and infrastructure to facilitate the creation of communities,
            where anyone is welcome to create, join and contribute.
            <br />
            <br />
            150+ passionate individuals (known as core-contributors) work
            together all around the world to facilitate Status’ mission. We care
            deeply about our mission, so we have created an environment which
            allows core-contributors to complete their work with freedom and
            flexibility. We regularly survey the core contributors to gather
            insights on their satisfaction with contributing to Status & the
            most common answers regarding why they’re satisfied are: our
            mission, values, flexibility, friendly environment, non-corporate
            culture and our entrepreneurial spirit.
          </Text>
        </div>
      </section>

      <div className="border-b border-dashed border-neutral-80/20 py-24 lg:py-40">
        <div className="container mb-12 lg:mb-20">
          <h2 className="text-40 lg:text-64">Perks and benefits</h2>
        </div>
        <FeatureList list={PERKS} />
      </div>

      <div className="container py-24 lg:py-40" ref={openRolesRef}>
        <div className="mb-12 lg:mb-20">
          <h2 className="text-40 lg:text-64">Open roles</h2>
        </div>

        <div className="grid gap-12 lg:gap-16">
          {/* JOB GROUPS */}
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="border-b border-dashed border-neutral-80/20"
            >
              <div>
                <h3 className="mb-3 text-27">Design</h3>
              </div>
              <div className="divide-y divide-dashed divide-neutral-80/20">
                {[
                  'Product designer',
                  'Visual designer',
                  'Motion designer',
                  'Illustrator',
                ].map(position => (
                  // TODO: discuss hover state
                  <Link
                    href="/jobs/senior-react-native-ui-developer"
                    key={position}
                    className="flex items-center justify-between py-5"
                  >
                    <Text size={19} weight="semibold">
                      {position}
                    </Text>
                    <div className="flex items-center gap-6">
                      <Text size={19}>Full-time</Text>
                      <Button
                        variant="outline"
                        size={40}
                        icon={<ArrowRightIcon size={20} />}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TODO FIX TEXTURE */}
      <div className="rounded-[40px] bg-[#F5F6FD]">
        <div className="container py-24 lg:py-40">
          <div className="mb-20">
            <h3 className="text-40">
              Open roles
              <br />
              in our network
            </h3>
          </div>
          <div className="grid gap-12">
            {['Logos', 'Codex', 'Waku', 'Nimbus', 'Vac'].map(name => (
              <div key={name} className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={logosImage}
                    width={24}
                    height={24}
                    alt={`${name} logo`}
                  />
                  <Text size={19} weight="semibold">
                    {name}
                  </Text>
                </div>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Link
                    key={i}
                    href="https://google.com"
                    className="group flex items-center"
                  >
                    <Text size={15} weight="medium">
                      Protocol Research Engineer
                    </Text>
                    <ExternalIcon
                      size={16}
                      className="transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[-2px]"
                    />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Content>
  )
}

const PERKS = [
  {
    title: 'Fully remote',
    description: 'Work from wherever you want, whenever you want. ',
    icon: illustrations.doge,
  },
  {
    title: 'Unlimited vacation',
    description:
      'Take all the time off you need. We need you in your best self.',
    icon: illustrations.doge,
  },
  {
    title: 'Paid team offsites',
    description: 'We meet at least once a year somewhere across the world. ',
    icon: illustrations.doge,
  },
  {
    title: 'Hardware stipend',
    description: 'Need a laptop to work? We got you covered.',
    icon: illustrations.doge,
  },
  {
    title: 'Co-working stipend',
    description:
      'We offer a $250 stipend for you to work from a co-working space.',
    icon: illustrations.doge,
  },
  {
    title: 'Get paid in crypto',
    description: 'We offer to pay salaries in SNT, ETH, USDC or fiat.',
    icon: illustrations.doge,
  },
  {
    title: 'SNT Bonus',
    description: 'We reward hard work and longevity with a bonus in SNT. ',
    icon: illustrations.doge,
  },
  {
    title: 'Referral fee',
    description:
      'We offer a $5000 SNT referral fee so bring your friends aboard.',
    icon: illustrations.doge,
  },
  {
    title: 'Headspace subscription',
    description:
      'Take care of your mind with a premium headspace account, for free.',
    icon: illustrations.doge,
  },
]

JobsPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default JobsPage
