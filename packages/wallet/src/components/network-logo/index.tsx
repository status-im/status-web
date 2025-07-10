import { cx } from 'class-variance-authority'
import { match } from 'ts-pattern'

import { Image } from '../image'

import type { NetworkType } from '../../data'

type Props = {
  name: NetworkType
  size: 12 | 16
}

// TODO: move to svg
export const NetworkLogo = ({ name, size }: Props) => {
  return (
    <div
      className={cx('rounded-full', {
        'h-3 w-3': size === 12,
        'h-4 w-4': size === 16,
      })}
    >
      {match(name)
        .with('ethereum', () => (
          <Image
            id="Wallet/Icons/Logos/01:120:120"
            className="size-fit"
            alt="mainnet"
          />
        ))
        .exhaustive()}
    </div>
  )
}
