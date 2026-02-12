import { cva, cx } from 'class-variance-authority'

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

function resolveIconUrl(icon: string): string {
  if (icon.startsWith('ipfs://')) {
    const cid = icon.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${cid}`
  }
  return icon
}

export function TokenIcon({ icon, name, symbol, size }: Props) {
  const initial = (symbol || name || '?').charAt(0).toUpperCase()
  if (icon) {
    const src = resolveIconUrl(icon)
    return <img src={src} alt={name} className={tokenIconStyles({ size })} />
  }

  return (
    <div
      className={cx([
        'flex items-center justify-center bg-neutral-20',
        tokenIconStyles({ size }),
      ])}
    >
      <span className="font-semibold text-neutral-40">{initial}</span>
    </div>
  )
}
