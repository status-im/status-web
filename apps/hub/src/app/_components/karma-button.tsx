'use client'

import { useEffect, useState } from 'react'

import { Button } from '@status-im/status-network/components'
import { cx } from 'cva'
import Image from 'next/image'

import { formatKarma } from '~utils/currency'

import { useKarmaRewardsDistributor } from '../_hooks/useKarmaRewardsDistributor'

import type { ComponentProps } from 'react'

type Props = {
  size?: ComponentProps<typeof Button>['size']
  label?: string
  className?: string
}

const KarmaButton = (props: Props) => {
  const { size: propSize, className, ...rest } = props
  const { data } = useKarmaRewardsDistributor()
  const [responsiveSize, setResponsiveSize] = useState<'24' | '32'>('24')

  useEffect(() => {
    // Tailwind md breakpoint
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      setResponsiveSize(e.matches ? '32' : '24')
    }

    handleResize(mediaQuery)

    mediaQuery.addEventListener('change', handleResize)

    return () => {
      mediaQuery.removeEventListener('change', handleResize)
    }
  }, [])

  const size = propSize ?? responsiveSize
  const amount = formatKarma(data?.balance ?? BigInt(0))

  return (
    <Button
      variant="secondary"
      size={size}
      className={cx(['flex', className])}
      iconBefore={
        <Image
          key={'karma'}
          src={'/tokens/karma.png'}
          alt={'Karma'}
          width="18"
          height="18"
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
