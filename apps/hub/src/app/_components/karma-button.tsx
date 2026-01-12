'use client'

import { ButtonLink } from '@status-im/status-network/components'
import { cx } from 'cva'
import Image from 'next/image'

import { formatKarma } from '~utils/currency'

import { useKarmaBalance } from '../_hooks/useKarmaBalance'

import type { ComponentProps } from 'react'

type Props = {
  size?: ComponentProps<typeof ButtonLink>['size']
  className?: string
}

const KarmaButton = (props: Props) => {
  const { size = '32', className, ...rest } = props
  const { data } = useKarmaBalance()

  const amount = formatKarma(data?.balance ?? BigInt(0), {
    compact: size === '32' ? false : true,
  })

  return (
    <ButtonLink
      variant="secondary"
      size={size}
      href="/karma"
      className={cx('flex items-center gap-2', className)}
      iconBefore={
        <Image
          src={'/tokens/karma.png'}
          alt={'Karma'}
          width="18"
          height="18"
          className="shrink-0"
        />
      }
      {...rest}
    >
      {amount}
    </ButtonLink>
  )
}

export { KarmaButton }
export type { Props as KarmaButtonProps }
