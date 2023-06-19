import { Text } from '@status-im/components'

import { LINKS, SOCIALS } from '@/config/links'

import { Logo } from '../logo'
import { Dot } from './components/dot'
import { MessariIcon } from './components/messari-icon'
import { Section } from './section'

type Props = {
  noBorderTop?: boolean
}

export const Footer = (props: Props) => {
  const { noBorderTop } = props
  console.log('noBorderTop', noBorderTop)
  const noBorderTopClassnames = noBorderTop ? 'border-t-0' : 'border-t'

  return (
    <footer className="hidden pb-3 sm:block">
      <div
        className={`border-neutral-80 border-dashed lg:px-6 ${noBorderTopClassnames}`}
      >
        <div className="grid grid-cols-4 gap-5 sm:gap-0 lg:mb-10 lg:grid-cols-8 lg:px-6">
          <div
            className={`border-neutral-80 mb-6 ${noBorderTopClassnames} border-dashed pl-6 pt-6 lg:pl-0`}
          >
            <Logo />
          </div>
          {Object.entries(LINKS).map(([title, links], index) => (
            <Section
              key={title}
              title={title}
              links={links}
              noBorderLeft={index === 3}
              noBorderTop={noBorderTop}
            />
          ))}
        </div>
        <div className="md-lg:flex-row item-start md-lg:items-center flex flex-col justify-between gap-2 px-5 lg:px-0">
          <div className="item-center flex gap-3">
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
                <IconComponent
                  key={social.name}
                  size={20}
                  color="$neutral-40"
                />
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
