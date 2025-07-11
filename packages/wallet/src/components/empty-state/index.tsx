import { match } from 'ts-pattern'

import { Image } from '../image'

import type { ImageId } from '../image'

type Props = {
  variant: 'activity' | 'collectible'
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
    .exhaustive()

  return (
    <div className="m-auto flex flex-col items-center justify-center text-center">
      <Image id={content.imageId} alt={content.imageAlt} className="size-20" />
      <h2 className="mb-0.5 text-15 font-600">{content.title}</h2>
      <p className="text-13">{content.description}</p>
    </div>
  )
}

export { EmptyState }
