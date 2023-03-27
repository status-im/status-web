import { tags as tagsMap } from './tags'

import type { Tag } from './map-community'

export const indicesToTags = (indices: number[]) => {
  const tagsMapByIndex = Object.entries(tagsMap)

  return indices.reduce<Array<[Tag['text'], Tag['emoji']]>>((tags, index) => {
    const tag = tagsMapByIndex[index]

    if (!tag) {
      return tags
    }

    tags.push([tag[0], tag[1]])

    return tags
  }, [])
}
