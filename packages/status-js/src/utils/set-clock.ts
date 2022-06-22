// todo: turn into get-clock and don't bind

import type { Chat } from '../client/chat'
import type { Community } from '../client/community/community'

export function setClock(this: Community | Chat, currentClock = 0n): bigint {
  const now = BigInt(Date.now()) // timestamp

  let nextClock: bigint
  if (currentClock < now) {
    nextClock = now
  } else {
    nextClock = currentClock + 1n
  }

  this.clock = nextClock

  return this.clock
}
