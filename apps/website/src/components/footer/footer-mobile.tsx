import { Text } from '@status-im/components'

import { SOCIALS } from '@/config/routes'

import { Logo } from '../logo'
import { AccordionMenu } from '../navigation/accordion-menu'
import { Dot } from './components/dot'
import { MessariIcon } from './components/messari-icon'

type Props = {
  hasBorderTop?: boolean
}

export const FooterMobile = (props: Props) => {
  const { hasBorderTop } = props

  return (
    <footer
      className={`block border-dashed border-neutral-80 ${
        hasBorderTop ? 'border-t' : 'border-t-0'
      } pb-12 sm:hidden`}
    >
      <div className="">
        <div className="flex flex-col px-2 pt-6">
          <div className="px-3 pb-3">
            <Logo />
          </div>
          <div className="pb-5">
            <AccordionMenu />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-dashed border-neutral-80 px-6 pt-6">
          <div className="flex w-full flex-col items-start gap-2 ">
            <Text size={11} color="$neutral-50">
              © Status Research & Development GmbH
            </Text>

            <div className="flex gap-3">
              <Text size={11} color="$neutral-40">
                Terms of use
              </Text>
              <Dot />
              <Text size={11} color="$neutral-40">
                Privacy policy
              </Text>
              <Dot />
              <Text size={11} color="$neutral-40">
                Cookies
              </Text>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-3">
            <div className="flex w-full items-center justify-start gap-3 py-2">
              <MessariIcon />
              <Text size={11} color="$neutral-50">
                Messari Transparency Verified
              </Text>
            </div>
            <div className="flex gap-3">
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
      </div>
    </footer>
  )
}
