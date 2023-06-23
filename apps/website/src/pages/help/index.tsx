import { Button, Text } from '@status-im/components'
import { ArrowRightIcon, StatusIcon } from '@status-im/icons'
import Image from 'next/image'
import Link from 'next/link'

// import { HighlightMatches } from '@/components/highlight-matches'
import { SearchButton } from '@/components/search-button'
// import { useSearchEngine } from '@/hooks/use-search-engine'
// import { ROUTES } from '@/config/routes'
import { AppLayout, PageBody } from '@/layouts/app-layout'

import img3 from '../../../public/images/help/communities.png'
import img1 from '../../../public/images/help/getting-started.png'
import img5 from '../../../public/images/help/profile-and-preferences.png'
import img2 from '../../../public/images/help/using-status.png'
import img4 from '../../../public/images/help/wallet.png'

import type { Page } from 'next'

// todo: use ROUTES
const SECTIONS = [
  {
    icon: <Image src={img1} alt="" width={48} height={48} />,
    title: 'Getting started',
    description:
      'Find out what makes Status unique, run Status for the first time and discover essential app features.',
  },
  {
    icon: <Image src={img2} alt="" width={48} height={48} />,
    title: 'Using Status',
    description:
      'Send messages, create group chats or explore decentralized apps with the Status dApp browser.',
  },
  {
    icon: <Image src={img3} alt="" width={48} height={48} />,
    title: 'Communities',
    description:
      "Create your community, set up private channels or join others' communities and channels.",
  },
  {
    icon: <Image src={img4} alt="" width={48} height={48} />,
    title: 'Wallet',
    description:
      'Store, send, receive and bridge crypto safely and anonymously.',
  },
  {
    icon: <Image src={img5} alt="" width={48} height={48} />,
    title: 'Profile and preferences',
    description:
      'Set up your Status profile and notifications, customize your settings and fix common issues.',
  },
] as const

const HelpPage: Page = () => {
  // const search = useSearchEngine()

  return (
    <div className="[--max-width:1186px]">
      <PageBody>
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

          {/* <div className="h-100 aspect-video w-full border border-dashed p-4">
            <input
              className="bg-neutral-20 border-neutral-60 block w-full rounded border p-4"
              onChange={async e => search.query(e.target.value)}
            />

            <div className="flex flex-col gap-3 p-10">
              {search.results.map(result => {
                return (
                  <div
                    key={result.title}
                    className="bg-neutral-20 flex flex-col"
                  >
                    <Text size={19} weight="semibold">
                      <HighlightMatches
                        text={result.title}
                        searchWords={result.match}
                      />
                    </Text>
                    {result.headings.map((heading, idx) => (
                      <div
                        key={heading.text + idx}
                        className="flex flex-col gap-2"
                      >
                        <Text size={13} weight="semibold">
                          <HighlightMatches
                            text={heading.text}
                            searchWords={heading.match}
                          />
                        </Text>
                        {heading.paragraphs.map(({ text, match }, idx) => {
                          return (
                            <Text size={13} key={text + idx}>
                              <HighlightMatches
                                text={text}
                                searchWords={match}
                              />
                            </Text>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div> */}

          <div className="grid grid-cols-3 gap-5">
            {SECTIONS.map(section => (
              <Link
                href="/help/getting-started"
                key={section.title}
                className="flex flex-col rounded-[20px] border border-neutral-10 p-4 shadow-1 transition duration-100 hover:scale-[1.01] hover:shadow-3"
              >
                <div className="mb-3">{section.icon}</div>
                <div className="mb-5 grid flex-1 gap-1">
                  <Text size={19} weight="semibold">
                    {section.title}
                  </Text>
                  <Text size={15}>{section.description}</Text>
                </div>

                <div className="flex">
                  <Button
                    variant="outline"
                    size={32}
                    iconAfter={<ArrowRightIcon size={20} color="$neutral-50" />}
                  >
                    Learn more
                  </Button>
                </div>
              </Link>
            ))}
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
      </PageBody>
    </div>
  )
}

HelpPage.getLayout = AppLayout

export default HelpPage
