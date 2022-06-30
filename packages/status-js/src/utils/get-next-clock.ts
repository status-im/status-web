export const getNextClock = (currentClock = 0n): bigint => {
  const now = BigInt(Date.now()) // timestamp
  const nextClock = currentClock < now ? now : currentClock + 1n

  return nextClock
}
