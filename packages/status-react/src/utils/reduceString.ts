export const reduceString = (
  string: string,
  limitBefore: number,
  limitAfter: number
) => {
  return `${string.substring(0, limitBefore)}...${string.substring(
    string.length - limitAfter
  )}`
}
