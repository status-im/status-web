'use client'

import { Button } from '@status-im/status-network/components'
import { cx } from 'cva'
import Image from 'next/image'

import { formatKarma } from '~utils/currency'

import { useKarmaRewardsDistributor } from '../_hooks/useKarmaRewardsDistributor'

import type { ComponentProps } from 'react'

type Props = {
  size?: ComponentProps<typeof Button>['size']
  className?: string
}

const KarmaButton = (props: Props) => {
  const { size = '32', className, ...rest } = props
  const { data } = useKarmaRewardsDistributor()
  const amount = formatKarma(data?.balance ?? BigInt(0))

  return (
    <Button
      variant="secondary"
      size={size}
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
    </Button>
  )
}

export { KarmaButton }
export type { Props as KarmaButtonProps }
