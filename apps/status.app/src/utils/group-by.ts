export function groupBy<T, K extends string | number>(
  list: T[],
  getter: (input: T) => K,
  initialValue: Record<K, T[]>
): Record<K, T[]> {
  const grouped: Record<K, T[]> = initialValue

  for (const item of list) {
    const key = getter(item)
    grouped[key] ??= []
    grouped[key].push(item)
  }

  return grouped
}
