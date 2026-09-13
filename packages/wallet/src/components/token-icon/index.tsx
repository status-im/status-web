import { cva, cx } from 'class-variance-authority'

import { TokenImage } from './token-image'

type Props = {
  icon?: string
  name: string
  symbol: string
  size: '24' | '32'
}

const tokenIconStyles = cva('rounded-full bg-neutral-10', {
  variants: {
    size: {
      '24': 'size-6 text-11',
      '32': 'size-8 text-13',
    },
  },
})

export function TokenIcon({ icon, name, symbol, size }: Props) {
  const initial = (symbol || name || '?').charAt(0).toUpperCase()

  return (
    <TokenImage
      src={icon}
      alt={name}
      className={tokenIconStyles({ size })}
      fallback={
        <div
          role="img"
          aria-label={name}
          className={cx([
            'flex items-center justify-center bg-neutral-20',
            tokenIconStyles({ size }),
          ])}
        >
          <span className="font-semibold text-neutral-40">{initial}</span>
        </div>
      }
    />
  )
}
