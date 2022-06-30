const MAX_OFFSET = BigInt(120 * 1000)

export function isClockValid(
  messageClock: bigint,
  messageTimestamp: Date
): boolean {
  if (messageClock <= 0) {
    return false
  }

  if (messageClock > BigInt(messageTimestamp.getTime()) + MAX_OFFSET) {
    return false
  }

  return true
}
