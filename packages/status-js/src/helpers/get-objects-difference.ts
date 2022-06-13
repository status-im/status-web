type Input<Value> = Record<string, Value>

export function getObjectsDifference<Value>(
  oldObject: Input<Value>,
  newObject: Input<Value>
) {
  const added: Record<string, Value> = {}
  const removed: string[] = []

  for (const key of Object.keys(oldObject)) {
    if (!newObject[key]) {
      removed.push(key)
    }
  }

  for (const key of Object.keys(newObject)) {
    if (!oldObject[key]) {
      added[key] = newObject[key]
    }
  }

  return { added, removed }
}
