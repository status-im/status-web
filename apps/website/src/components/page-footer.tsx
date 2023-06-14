import { Button, Text } from '@status-im/components'
import Link from 'next/link'

import { LINKS, SOCIALS } from '@/config/links'

import { Logo } from './logo'

import type { Links } from '@/config/links'

export const PageFooter = () => {
  return (
    <footer className="px-6 pb-3 pt-14">
      <div className="mb-6">
        <Logo />
      </div>
      <div className="mb-10 grid grid-cols-2 lg:grid-cols-8">
        {Object.entries(LINKS).map(([title, links]) => (
          <Section key={title} title={title} links={links} />
        ))}

        <div>
          <Text size={13} color="$neutral-50">
            {"Let's connect"}
          </Text>
          <div className="flex flex-col">
            {Object.values(SOCIALS).map(social => (
              <Text size={11} key={social.name}>
                {social.name}
              </Text>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 grid gap-5 lg:grid-cols-[2fr_1fr]">
        <ActionCard
          title="Own a community?"
          description="Don't give Discord and Telegram power over your community"
          action="Take back control"
        />
        <ActionCard
          title="Give us feedback!"
          description="Tell us how to make it better"
          action="Upvote"
        />
      </div>

      <div className="flex items-center gap-2">
        <Text size={11} color="$neutral-50">
          © Status Research & Development GmbH
        </Text>

        <span>
          <svg
            width="2"
            height="2"
            viewBox="0 0 2 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="1" cy="1" r="1" fill="#647084" />
          </svg>
        </span>

        <div className="flex gap-3">
          <Text size={11} color="$neutral-40">
            Terms of use
          </Text>
          <Text size={11} color="$neutral-40">
            Privacy policy
          </Text>
          <Text size={11} color="$neutral-40">
            Cookies
          </Text>
        </div>
      </div>
    </footer>
  )
}

type SectionProps = {
  title: string
  links: Links
}

const Section = (props: SectionProps) => {
  const { title, links } = props

  return (
    <div>
      <div className="grid gap-3">
        <Text size={13} color="$neutral-50">
          {title}
        </Text>
        <ul className="grid gap-1">
          {links.map(link => (
            <li key={link.name}>
              <Link href={link.href}>
                <Text size={15} color="$white-100" weight="medium">
                  {link.name}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

type ActionCardProps = {
  title: string
  description: string
  action: string
}

const ActionCard = (props: ActionCardProps) => {
  const { title, description, action } = props

  return (
    <div className="bg-netural-95 flex items-center rounded-[20px] border border-neutral-90 px-5 py-3">
      <div className="grid flex-1 gap-px">
        <Text size={19} color="$white-100" weight="semibold">
          {title}
        </Text>
        <Text size={15} color="$white-100">
          {description}
        </Text>
      </div>
      <Button size={32} variant="darkGrey">
        {action}
      </Button>
    </div>
  )
}
