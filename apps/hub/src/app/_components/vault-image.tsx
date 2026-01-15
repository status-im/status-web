import { cva } from 'cva'
import Image from 'next/image'
import { match } from 'ts-pattern'
import { linea, mainnet } from 'viem/chains'

export type VaultImageType = {
  vault: string
  network?: (typeof mainnet | typeof linea)['name']
  size: '20' | '32' | '56'
}

const vaultImageStyles = cva({
  base: 'relative',
  variants: {
    size: {
      '20': 'size-5',
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
      '20': '-bottom-0.5 -right-0.5 size-2',
      '32': '-bottom-1 -right-1 size-3',
      '56': '-bottom-1 -right-1 size-5',
    },
  },
  defaultVariants: {
    size: '32',
  },
})

const sizeMap = {
  '20': { image: 20, network: 8 },
  '32': { image: 32, network: 12 },
  '56': { image: 56, network: 20 },
} as const

export function VaultImage({
  vault,
  network = mainnet.name,
  size,
}: VaultImageType) {
  const networkImage = match(network)
    .with(mainnet.name, () => '/networks/ethereum.png')
    .with(linea.name, () => '/networks/linea.png')
    .exhaustive()

  const dimensions = sizeMap[size]

  return (
    <div className={vaultImageStyles({ size })}>
      <Image
        src={`/vaults/${vault.toLowerCase()}.png`}
        alt={vault}
        width={dimensions.image}
        height={dimensions.image}
        quality="100"
      />
      {size !== '20' && (
        <Image
          src={networkImage}
          alt={network}
          width={dimensions.network}
          height={dimensions.network}
          className={vaultNetworkImageStyles({ size })}
        />
      )}
    </div>
  )
}
