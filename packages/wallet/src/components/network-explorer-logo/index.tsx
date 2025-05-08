import { cx } from 'class-variance-authority'
import { match } from 'ts-pattern'

import { Image } from '../image'

type Props = {
  name: 'etherscan' | 'arbiscan' | 'basescan' | 'polygonscan' | 'bscscan'
}

// TODO: move to svg
export const NetworkExplorerLogo = ({ name }: Props) => {
  return (
    <div className={cx('size-4 rounded-full')}>
      {match(name)
        .with('etherscan', () => (
          <Image
            id="Portfolio/Logos/Etherscan:32:32"
            className="size-5"
            alt=""
          />
        ))
        .with('arbiscan', () => (
          <Image
            id="Portfolio/Logos/Arbiscan:32:32"
            className="size-4"
            alt=""
          />
        ))
        .with('basescan', () => (
          <Image
            id="Portfolio/Logos/Etherscan:32:32"
            className="size-4"
            alt=""
          />
        ))
        .with('polygonscan', () => (
          <Image
            id="Portfolio/Logos/Etherscan:32:32"
            className="size-4"
            alt=""
          />
        ))
        .with('bscscan', () => (
          <Image
            id="Portfolio/Logos/Etherscan:32:32"
            className="size-4"
            alt=""
          />
        ))
        .exhaustive()}
    </div>
  )
}
