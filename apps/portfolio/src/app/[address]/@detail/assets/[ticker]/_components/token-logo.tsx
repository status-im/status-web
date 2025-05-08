// We need to add this eslint-disable rule since we can't use next/image in this use case because we don't know the source of the image. Therefore we use the native <img> tag.
/* eslint-disable @next/next/no-img-element */

import { cx } from 'class-variance-authority'

type Props = {
  variant?: 'default' | 'small'
  name: string
  ticker: string
  icon: string
}

const TokenLogo = (props: Props) => {
  const { name, ticker, icon, variant = 'default' } = props

  return (
    <div className="flex items-center gap-1.5 pb-0">
      <img
        className="size-5 flex-shrink-0 rounded-full bg-neutral-10"
        alt={name}
        src={icon}
      />
      <div
        className={cx([
          'text-19 font-semibold text-neutral-100 2xl:text-15',
          variant === 'small' && 'max-w-20 truncate',
        ])}
      >
        {name}
      </div>
      <div className="pt-[5px] text-13 font-medium text-neutral-50 2xl:pt-0">
        {ticker}
      </div>
    </div>
  )
}

export { TokenLogo }
