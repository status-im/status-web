import { createCloudinaryUrl } from './loader'

import type { ImageAlt, ImageId } from './types'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLImageElement> & {
  id: ImageId
  alt?: string | ImageAlt
}

const Image = (props: Props) => {
  const { id, alt, ...rest } = props

  const altText =
    typeof alt === 'object'
      ? alt[id] || 'Image not available'
      : alt || 'Image not available'

  return <img src={createCloudinaryUrl(id)} alt={altText} {...rest} />
}

export { Image }
export type { Props as ImageProps }
