'use client'

import { cx } from 'cva'
import Image from 'next/image'

import { Link } from '~/i18n/navigation'
import { formatKarma } from '~utils/currency'

import { useKarmaBalance } from '../_hooks/useKarmaBalance'

type Props = {
  size?: '24' | '32' | '40'
  className?: string
}

const KarmaButton = (props: Props) => {
  const { size = '32', className } = props
  const { data } = useKarmaBalance()

  const amount = formatKarma(data?.balance ?? BigInt(0), {
    compact: size === '32' ? false : true,
  })

  const sizeClasses = {
    '24': 'h-6 rounded-8 px-2 py-[3px] text-13',
    '32': 'h-8 rounded-10 py-[5px] text-15 pl-2 pr-3',
    '40': 'h-10 rounded-12 py-[9px] text-15 pl-3 pr-4',
  }

  return (
    <Link
      href="/karma"
      className={cx(
        'inline-flex w-fit cursor-pointer select-none items-center gap-2 whitespace-nowrap border font-500 transition-all',
        'border-white-10 bg-white-5 text-white-100 hover:border-white-20 hover:bg-white-10',
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={'/tokens/karma.png'}
        alt={'Karma'}
        width="18"
        height="18"
        className="shrink-0"
      />
      {amount}
    </Link>
  )
}

export { KarmaButton }
export type { Props as KarmaButtonProps }
