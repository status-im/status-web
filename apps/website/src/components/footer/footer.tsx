import { Text } from '@status-im/components'
import { cva } from 'class-variance-authority'

import { ROUTES, SOCIALS } from '@/config/routes'

import { Logo } from '../logo'
import { Dot } from './components/dot'
import { MessariIcon } from './components/messari-icon'
import { Section } from './section'

type Props = {
  hasBorderTop?: boolean
}

const section = cva(
  [
    'border-neutral-80',
    'mb-6',
    'flex',
    'items-start',
    'border-dashed',
    'pl-6',
    'pt-6',
  ],
  {
    variants: {
      hasBorderTop: {
        true: ['border-t'],
        false: ['border-t-0'],
      },
    },
  }
)

export const Footer = (props: Props) => {
  const { hasBorderTop } = props

  return (
    <footer className="hidden pb-3 sm:block">
      <div className="grid grid-cols-4 gap-5 sm:gap-0 lg:mb-10 lg:grid-cols-8">
        <div
          className={section({
            hasBorderTop,
          })}
        >
          <Logo />
        </div>
        {Object.entries(ROUTES).map(([title, links], index) => (
          <Section
            key={title}
            title={title}
            routes={links}
            hasBorderLeft={index !== 3}
            hasBorderTop={hasBorderTop}
          />
        ))}
      </div>
      <div className="flex flex-col items-start justify-between gap-2 px-5 lg:px-6 md-lg:flex-row md-lg:items-center">
        <div className="flex items-center gap-3">
          <Text size={11} color="$neutral-50">
            © Status Research & Development GmbH
          </Text>
          <Dot />
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
        <div className="flex gap-3">
          <div className="flex items-center gap-3">
            <MessariIcon />
            <Text size={11} color="$neutral-50">
              Messari Transparency Verified
            </Text>
            <Dot />
          </div>
          {Object.values(SOCIALS).map(social => {
            const IconComponent = social.icon
            return (
              <IconComponent key={social.name} size={20} color="$neutral-40" />
            )
          })}
        </div>
      </div>
    </footer>
  )
}
