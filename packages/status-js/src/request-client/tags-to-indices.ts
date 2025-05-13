import { tags as tagsMap } from './tags'

export const tagsToIndices = (tags: string[]): number[] => {
  const tagsMapByIndex = Object.entries(tagsMap)

  return tags.reduce<number[]>((indices, tag) => {
    const index = tagsMapByIndex.findIndex(([text]) => text === tag)

    if (index !== -1) {
      indices.push(index)
    }

    return indices
  }, [])
}
