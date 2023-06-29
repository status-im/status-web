import { Button, Text } from '@status-im/components'
import { ArrowRightIcon, StatusIcon } from '@status-im/icons'
import Image from 'next/image'
import Link from 'next/link'

import { SearchButton } from '@/components/search-button'
import { illustrations } from '@/config/illustrations'
import { ROUTES } from '@/config/routes'
import { AppLayout, Content } from '@/layouts/app-layout'

import type { Page } from 'next'

const METADATA = {
  Overview: {
    icon: illustrations.skull,
    description:
      'Find out what makes Status unique, run Status for the first time and discover essential app features.',
  },
  'Getting Started': {
    icon: illustrations.skull,
    description:
      'Find out what makes Status unique, run Status for the first time and discover essential app features.',
  },
  Messaging: {
    icon: illustrations.pizza,
    description:
      'Send messages, create group chats or explore decentralized apps with the Status dApp browser.',
  },
  Communities: {
    icon: illustrations.megaphone,
    description:
      "Create your community, set up private channels or join others' communities and channels.",
  },
  Wallet: {
    icon: illustrations.lock,
    description:
      'Store, send, receive and bridge crypto safely and anonymously.',
  },
  Profile: {
    icon: illustrations.mushroom,
    description:
      'Set up your Status profile and notifications, customize your settings and fix common issues.',
  },
} as const

const HelpPage: Page = () => {
  return (
    <div className="[--max-width:1186px]">
      <Content>
        <div className="mx-auto max-w-[var(--max-width)] py-20">
          <div className="mb-20 flex items-end justify-between">
            <div>
              <h1 className="text-[64px] font-bold">{"Let's help you"}</h1>
              <Text size={19}>
                Technical, short form guides on how to setup and use the app
              </Text>
            </div>
            <SearchButton size={38} />
          </div>

          <div className="grid grid-cols-3 gap-5">
            {ROUTES.Help.filter(r => r.name !== 'Overview').map(route => {
              const { icon, description } = METADATA[route.name]

              return (
                <Link
                  href={route.href}
                  key={route.name}
                  className="flex flex-col rounded-[20px] border border-neutral-10 p-4 shadow-1 transition duration-100 hover:scale-[1.01] hover:shadow-3"
                >
                  <div className="mb-3">
                    <Image {...icon} alt={icon.alt} />
                  </div>
                  <div className="mb-5 grid flex-1 gap-1">
                    <Text size={19} weight="semibold">
                      {route.name}
                    </Text>
                    <Text size={15}>{description}</Text>
                  </div>

                  <div className="flex">
                    <Button
                      variant="outline"
                      size={32}
                      iconAfter={
                        <ArrowRightIcon size={20} color="$neutral-50" />
                      }
                    >
                      Learn more
                    </Button>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="border-t border-dashed border-neutral-30 py-10">
          <div className="mx-auto flex max-w-[var(--max-width)] flex-col items-start">
            <div className="mb-4 flex flex-col">
              <Text size={19} weight="semibold">
                {"Didn't find answers?"}
              </Text>
              <Text size={15}>Ask around in our community!</Text>
            </div>

            <Button
              variant="outline"
              size={32}
              iconAfter={<StatusIcon size={20} color="$neutral-50" />}
            >
              Say Hello in
            </Button>
          </div>
        </div>
      </Content>
    </div>
  )
}

HelpPage.getLayout = page => {
  return <AppLayout>{page}</AppLayout>
}

export default HelpPage
