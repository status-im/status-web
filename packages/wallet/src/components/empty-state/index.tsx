import { cva } from 'cva'
import { match } from 'ts-pattern'

import { Image } from '../image'

import type { ImageId } from '../image'

const styles = cva({
  variants: {
    variant: {
      activity: 'size-20',
      collectible: 'size-20',
      balance: 'h-[112px]',
      price: 'h-[112px]',
      value: 'h-[112px]',
    },
  },
})

type Props = {
  variant: 'activity' | 'collectible' | 'balance' | 'price' | 'value'
}

const EmptyState = (props: Props) => {
  const { variant } = props

  const content = match(variant)
    .with('activity', () => ({
      imageId: 'admin/empty/devices:241:240' as ImageId,
      imageAlt: 'No activity',
      title: 'No Activity',
      description: 'Transaction history will be visible on this page',
    }))
    .with('collectible', () => ({
      imageId: 'Portfolio/Empty States/No_Collectibles:161:160' as ImageId,
      imageAlt: 'No collectibles',
      title: 'No Collectibles',
      description: 'Your collectibles will be visible on this page',
    }))
    .with('balance', () => ({
      imageId: 'Portfolio/Empty States/No_Balance:750:232' as ImageId,
      imageAlt: 'No balance',
      title: 'No balance',
      description: 'Hodl this asset to view your balance history here',
    }))
    .with('price', () => ({
      imageId: 'Portfolio/Empty States/No_Balance:750:232' as ImageId,
      imageAlt: 'No prices',
      title: 'No prices',
      description: 'Prices will be visible on this page',
    }))
    .with('value', () => ({
      imageId: 'Portfolio/Empty States/No_Balance:750:232' as ImageId,
      imageAlt: 'No value',
      title: 'No value',
      description: 'Portfolio value history will be visible on this page',
    }))
    .exhaustive()

  return (
    <div className="m-auto flex flex-col items-center justify-center text-center">
      <Image
        id={content.imageId}
        alt={content.imageAlt}
        className={styles({ variant })}
      />
      <h2 className="mb-0.5 text-15 font-600">{content.title}</h2>
      <p className="text-13">{content.description}</p>
    </div>
  )
}

export { EmptyState }
