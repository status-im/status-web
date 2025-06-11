import { Avatar } from '@status-im/components'
import { InsightsIcon } from '@status-im/icons/20'
import { cva, cx } from 'class-variance-authority'
import Link from 'next/link'

// import { AddAddress } from '../add-address'
import { CurrencyAmount } from '../currency-amount'
// import { FeatureEnabled } from '../feature-enabled'
import { Tooltip } from '../tooltip'

import type { CustomisationColorType } from '@status-im/components'

const linkClasses = cva(
  'flex h-8 w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-10 border text-neutral-100 transition-colors 4xl:w-full 4xl:justify-start 4xl:gap-2 4xl:pl-1',
  {
    variants: {
      active: {
        true: '',
        false: 'border-transparent',
      },
      paired: {
        true: 'border-solid',
        false: 'border-dashed',
      },
    },
    defaultVariants: {
      paired: false,
    },
  },
)

export type Account = {
  name: string
  emoji: string
  color: CustomisationColorType
  address: string
  wallet?: {
    connector: string
    connected: boolean
  }
}

type LinkProp = Account & {
  href: string
  paired: boolean
  amount: number
}

type Props = {
  links: LinkProp[]
  matchesUltraLargeDesktop?: boolean
  pathname: string
}

const SideNav = (props: Props) => {
  const { links, matchesUltraLargeDesktop, pathname } = props

  return (
    <div className="z-20 flex shrink-0 flex-col items-start gap-3 bg-white-100 p-3 transition-all">
      {links.map(link => {
        const active = pathname!.includes(link.address)

        return (
          <Tooltip
            key={link.address}
            label={
              <span className="flex items-center gap-2">
                {link.name}
                {link.amount > 0 ? (
                  <span className="text-neutral-50">
                    <CurrencyAmount value={link.amount} format="standard" />
                  </span>
                ) : undefined}{' '}
                {!link.wallet && (
                  <span className="border-l border-l-neutral-10 pl-2">
                    <InsightsIcon className="text-neutral-50" />
                  </span>
                )}
              </span>
            }
            hidden={matchesUltraLargeDesktop}
          >
            <div className="flex w-full" data-customisation={link.color}>
              <Link
                href={link.href}
                aria-selected={active}
                className={cx(
                  linkClasses({
                    active,
                    paired: link.paired,
                  }),
                  'hover:bg-customisation-50/10',
                  active &&
                    'border-customisation-50/20 bg-customisation-50/10 hover:border-customisation-50/30 hover:bg-customisation-50/20',
                )}
              >
                {'emoji' in link && (
                  <Avatar
                    type="account"
                    name={link.name}
                    emoji={link.emoji}
                    size="32"
                    bgOpacity="5"
                  />
                )}
                <div className="flex w-0 items-center justify-between gap-2 text-15 font-500 opacity-[0] transition-all 4xl:mr-2 4xl:w-[190px] 4xl:opacity-[1]">
                  <span className="truncate">{link.name}</span>
                  <span className="relative flex text-neutral-50">
                    <CurrencyAmount value={link.amount} format="standard" />
                  </span>
                </div>
              </Link>
            </div>
          </Tooltip>
        )
      })}

      {/* <FeatureEnabled featureFlag="WATCHED_ADDRESSES">
        <AddAddress />
      </FeatureEnabled> */}
    </div>
  )
}

export { SideNav, type LinkProp as SideNavLinkProps }
