import { cx } from 'class-variance-authority'
import { match } from 'ts-pattern'

import { Image } from '../_components/assets'

type Props = {
  name: 'etherscan'
}

// TODO: move to svg
export const NetworkExplorerLogo = ({ name }: Props) => {
  return (
    <div className={cx('size-4 rounded-full')}>
      {match(name)
        .with('etherscan', () => (
          <Image
            id="Portfolio/Logos/Etherscan:32:32"
            width={20}
            height={20}
            alt=""
          />
        ))
        .exhaustive()}
    </div>
  )
}
