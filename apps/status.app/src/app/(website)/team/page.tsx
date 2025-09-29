import { Button, Tag, Text } from '@status-im/components'
import { ArrowRightIcon, ExternalIcon } from '@status-im/icons/20'

import { Metadata } from '~app/_metadata'
import { Image } from '~components/assets'
import { Body } from '~components/body'
import { Link } from '~components/link'
import { ParallaxCircle } from '~website/_components/parallax-circle'

import { CircleWord } from '../_components/circle-word'
import { OrgChart } from './_components/org-chart'

import type { ImageType } from '~components/assets'

export const metadata = Metadata({
  title: 'Team',
  description: 'The team behind Status.',
})

export default function TeamPage() {
  return (
    <Body>
      <div className="container mb-11 max-w-[742px] pt-24 xl:mb-20 xl:pt-40">
        <div className="mb-4 flex">
          <Tag size="32" label="Team" />
        </div>
        <h1 className="text-27 font-regular xl:text-40">
          Founded in 2017, Status has grown to{' '}
          <CircleWord
            imageId="Team/Scribbles and Notes/Scribble_01:478:169"
            className="!top-[-4%]"
          >
            <span className="whitespace-nowrap">over 90</span>
          </CircleWord>{' '}
          core contributors. The last 18 months has been a period of growth,
          attracting a large community who ardently seek to defend{' '}
          <CircleWord imageId="Team/Scribbles and Notes/Scribble_02:772:196">
            human rights.
          </CircleWord>
        </h1>
      </div>

      <div className="relative mb-24">
        <ParallaxCircle color="purple" className="left-0 top-[-80px]" />
        <ParallaxCircle color="sky" className="right-0 top-[200px]" />
        <ParallaxCircle color="orange" className="left-[220px] top-[200px]" />
        <ParallaxCircle
          color="sky"
          className="right-[100px] top-[560px] xl:top-0"
        />

        <div className="relative z-20 mx-auto max-w-[1512px]">
          <div className="-mx-72 xl:-mx-40">
            <Image id="Team/Photos/Team_01:6400:2501" alt="" priority />
          </div>
        </div>
      </div>

      <div className="container relative grid grid-cols-1 gap-12 pb-24 xl:grid-cols-3 xl:gap-14 xl:pb-40">
        {ABOUT_LIST.map(item => (
          <div key={item.title} className="relative z-20">
            <h3 className="mb-2 text-19 font-600">{item.title}</h3>
            <Text size={19}>{item.description}</Text>
            <Link
              href={item.cta.href}
              className="mt-3 flex items-center gap-1 text-19 font-medium transition-colors hover:text-neutral-50"
            >
              {item.cta.label}
              <ArrowRightIcon />
            </Link>
          </div>
        ))}
        <ParallaxCircle color="orange" className="bottom-[-320px] right-0" />
      </div>
      <div className="border-dashed-default relative overflow-hidden border-b bg-white-100">
        <ParallaxCircle
          color="purple"
          className="left-0 top-[-80px] z-10 hidden sm:block"
        />
        <ParallaxCircle
          color="army"
          className="-bottom-1/2 right-40 z-10 hidden sm:block"
        />
        <div className="border-dashed-default relative z-20 border-t pt-24 xl:pt-40">
          <h2 className="text-center text-40 font-bold xl:text-64">
            +90 core
            <br />
            contributors
          </h2>
        </div>
        <div className="relative z-20 flex justify-center pb-24 pt-14 2md:pb-40 2md:pt-20">
          <OrgChart />
        </div>
      </div>

      <div className="container py-24 lg:py-40">
        <div className="mb-16 lg:mb-20">
          <h2 className="text-40 font-bold xl:text-64">Our Network</h2>
        </div>

        <div className="grid gap-3 md:gap-4 2md:grid-cols-2 lg:grid-cols-3 xl:gap-5">
          {NETWORK_LIST.map(item => (
            <div
              key={item.title}
              className="flex cursor-default flex-col rounded-20 border border-neutral-20 p-4 shadow-1 transition-shadow hover:shadow-3"
            >
              <div className="flex-1">
                <div className="mb-3">
                  <Image {...item.image} width={48} height={48} />
                </div>
                <h3 className="mb-1 text-19 font-600">{item.title}</h3>
                <p className="mb-5 text-15">{item.description}</p>
              </div>
              <div className="shrink-0">
                <Button
                  variant="outline"
                  href={item.url}
                  size="32"
                  iconAfter={<ExternalIcon />}
                >
                  {item.url.replace('https://', '')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Body>
  )
}

const ABOUT_LIST = [
  {
    title: 'Who are we?',
    description:
      'Jarrad Hope and Carl Bennetts envisioned the organisation while thinking about how online forums and games incubated communities with a multitude of unique cultures, and how the freedom that birthed these communities was at risk from the growing digital panopticon.',
    cta: {
      label: 'Help build a free digital world',
      href: '/jobs',
    },
  },
  {
    title: 'Why Status?',
    description:
      "Big tech platforms and other centralised actors have the power to siphon people's data, sell it to the highest bidder or use it as a tool to commodify and control behaviour. Jarrad and Carl saw this as an unconscionable affront to human decency, solidifying the goals and focus of the organisation.",
    cta: {
      label: 'View our manifesto',
      href: '/manifesto',
    },
  },
  {
    title: 'Where are we?',
    description:
      'Status has grown from two in 2017 to over 90 core contributors in 2023. It has developed most rapidly in the last 18 months, attracting a large community who ardently seek to build software that defends human rights. The org is positioned to generate waves in the crypto ecosystem.',
    cta: {
      label: 'Be part of the privacy revolution',
      href: '/jobs',
    },
  },
] satisfies Array<{
  title: string
  description: string
  cta: {
    label: string
    href: string
  }
}>

const NETWORK_LIST = [
  {
    image: { id: 'Team/Network Section/Logos:96:96', alt: 'Logos logo' },
    title: 'Logos',
    description:
      'Building the tools & nurturing the culture of the network state movement.',
    url: 'https://logos.co',
  },
  {
    image: { id: 'Team/Network Section/Nomos:96:96', alt: 'Nomos logo' },
    title: 'Nomos',
    description:
      "Nomos is a novel blockchain project that will address a network state's fundamental need for adaptable privacy and sovereignty.",
    url: 'https://nomos.tech',
  },
  {
    image: { id: 'Team/Network Section/Waku:96:96', alt: 'Waku logo' },
    title: 'Waku',
    description:
      'A family of robust, censorship-resistant communication protocols designed to enable privacy-focused messaging for web3 apps.',
    url: 'https://waku.org',
  },
  {
    image: { id: 'Team/Network Section/Codex:96:96', alt: '' },
    title: 'Codex',
    description:
      'Codex is a durable, decentralised data storage protocol, created so the world community can preserve its most important knowledge.',
    url: 'https://codex.storage',
  },
  {
    image: { id: 'Team/Network Section/Vac:96:96', alt: 'Vac logo' },
    title: 'Vac',
    description:
      'Vac builds public good protocols for the decentralised web, with a focus on privacy and communication.',
    url: 'https://vac.dev',
  },
] satisfies Array<{
  image: ImageType
  title: string
  description: string
  url: string
}>
