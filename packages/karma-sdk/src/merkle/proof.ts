import { encodePacked, keccak256 } from 'viem'

import { hashLeaf, type AirdropEntry } from './tree'

export function verifyMerkleProof(
  entry: AirdropEntry,
  proof: `0x${string}`[],
  root: `0x${string}`
): boolean {
  let computedHash = hashLeaf(entry)

  for (const proofElement of proof) {
    const [left, right] =
      computedHash.toLowerCase() < proofElement.toLowerCase()
        ? [computedHash, proofElement]
        : [proofElement, computedHash]

    computedHash = keccak256(
      encodePacked(
        ['bytes32', 'bytes32'],
        [left as `0x${string}`, right as `0x${string}`]
      )
    )
  }

  return computedHash.toLowerCase() === root.toLowerCase()
}
