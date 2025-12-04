import { cva } from 'cva'
import Image from 'next/image'
import { match } from 'ts-pattern'
import { linea, mainnet } from 'viem/chains'

export type VaultImageType = {
  vault: string
  network: (typeof mainnet | typeof linea)['name']
  size: '32' | '56'
}

const vaultImageStyles = cva({
  base: 'relative',
  variants: {
    size: {
      '32': 'size-8',
      '56': 'size-14',
    },
  },
  defaultVariants: {
    size: '32',
  },
})

const vaultNetworkImageStyles = cva({
  base: 'absolute rounded-full border-2 border-white-100 bg-white-100',
  variants: {
    size: {
      '32': '-bottom-1 -right-1 size-3',
      '56': '-bottom-1 -right-1 size-5',
    },
  },
  defaultVariants: {
    size: '32',
  },
})

export function VaultImage({ vault, network, size }: VaultImageType) {
  const networkImage = match(network)
    .with(mainnet.name, () => '/networks/ethereum.png')
    .with(linea.name, () => '/networks/linea.png')
    .exhaustive()

  return (
    <div className={vaultImageStyles({ size })}>
      <Image
        src={`/vaults/${vault.toLowerCase()}.png`}
        alt={vault}
        width={size === '32' ? 32 : 56}
        height={size === '32' ? 32 : 56}
        quality="100"
      />
      <Image
        src={networkImage}
        alt={network}
        width={size === '32' ? 12 : 20}
        height={size === '32' ? 12 : 20}
        className={vaultNetworkImageStyles({ size })}
      />
    </div>
  )
}
