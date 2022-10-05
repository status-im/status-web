/**
 * source: @see https://github.com/waku-org/js-waku/blob/d2ac62c70809309c5052633482ccdff104f87ac8/src/lib/predefined_bootstrap_nodes.ts
 * source: @see https://github.com/waku-org/js-waku/blob/d2ac62c70809309c5052633482ccdff104f87ac8/src/lib/random_subset.ts
 */

import { fleets } from '../consts/fleets'

export const DefaultWantedNumber = 1

export type Fleet = 'prod' | 'test'

export function getPredefinedBootstrapNodes(
  fleet: Fleet = 'prod',
  wantedNumber: number = DefaultWantedNumber
): string[] {
  if (wantedNumber <= 0) {
    return []
  }

  let nodes
  switch (fleet) {
    case 'prod':
      nodes = fleets.fleets['status.prod']['wss/p2p/waku']
      break
    case 'test':
      nodes = fleets.fleets['status.test']['wss/p2p/waku']
      break
    default:
      nodes = fleets.fleets['status.prod']['wss/p2p/waku']
  }

  nodes = Object.values(nodes) as string[]

  return getPseudoRandomSubset(nodes, wantedNumber)
}

function getPseudoRandomSubset<T>(values: T[], wantedNumber: number): T[] {
  if (values.length <= wantedNumber || values.length <= 1) {
    return values
  }

  return shuffle(values).slice(0, wantedNumber)
}

function shuffle<T>(arr: T[]): T[] {
  if (arr.length <= 1) {
    return arr
  }
  const randInt = (): number => {
    return Math.floor(Math.random() * Math.floor(arr.length))
  }

  for (let i = 0; i < arr.length; i++) {
    const j = randInt()
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}
