export function getDifferenceByKeys<T extends Record<string, unknown>>(
  a: T,
  b: T
): T {
  const initialValue: Record<string, unknown> = {}

  const result = Object.entries(a).reduce((result, [key, value]) => {
    if (!b[key]) {
      result[key] = value
    }

    return result
  }, initialValue)

  return result as T
}
