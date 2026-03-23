export function timespan(lastVote: Date) {
  const diff = Date.now() - lastVote.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
