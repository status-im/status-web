import { encodePacked, keccak256 } from 'viem'

export interface AirdropEntry {
  index: bigint
  account: `0x${string}`
  amount: bigint
}

export interface MerkleTreeOutput {
  root: `0x${string}`
  entries: Array<AirdropEntry & { proof: `0x${string}`[] }>
}

export function hashLeaf(entry: AirdropEntry): `0x${string}` {
  return keccak256(
    encodePacked(
      ['uint256', 'address', 'uint256'],
      [entry.index, entry.account, entry.amount],
    ),
  )
}

function hashPair(a: `0x${string}`, b: `0x${string}`): `0x${string}` {
  const [left, right] = a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a]
  return keccak256(
    encodePacked(
      ['bytes32', 'bytes32'],
      [left as `0x${string}`, right as `0x${string}`],
    ),
  )
}

export function buildMerkleTree(entries: AirdropEntry[]): MerkleTreeOutput {
  if (entries.length === 0) {
    throw new Error('Cannot build merkle tree from empty entries')
  }

  const leaves = entries.map(e => hashLeaf(e))

  // Build tree layers bottom-up
  const layers: `0x${string}`[][] = [leaves]

  while (layers[layers.length - 1]!.length > 1) {
    const currentLayer = layers[layers.length - 1]!
    const nextLayer: `0x${string}`[] = []
    for (let i = 0; i < currentLayer.length; i += 2) {
      if (i + 1 < currentLayer.length) {
        nextLayer.push(hashPair(currentLayer[i]!, currentLayer[i + 1]!))
      } else {
        nextLayer.push(currentLayer[i]!)
      }
    }
    layers.push(nextLayer)
  }

  const root = layers[layers.length - 1]![0]!

  // Generate proofs
  const result: MerkleTreeOutput['entries'] = entries.map(
    (entry, entryIndex) => {
      const proof: `0x${string}`[] = []
      let idx = entryIndex

      for (let layerIdx = 0; layerIdx < layers.length - 1; layerIdx++) {
        const layer = layers[layerIdx]!
        const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1

        if (siblingIdx < layer.length) {
          proof.push(layer[siblingIdx]!)
        }
        idx = Math.floor(idx / 2)
      }

      return { ...entry, proof }
    },
  )

  return { root, entries: result }
}
