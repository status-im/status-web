import { tags as tagsMap } from './tags'

import type { Tag } from './map-community'

export const indicesToTags = (indices: number[]) => {
  const tagsMapByIndex = Object.entries(tagsMap)

  return indices.reduce<Tag[]>((tags, index) => {
    const tag = tagsMapByIndex[index]

    if (!tag) {
      return tags
    }

    tags.push({ text: tag[0], emoji: tag[1] })

    return tags
  }, [])
}
