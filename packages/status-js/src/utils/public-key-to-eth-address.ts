import { ethers } from 'ethers'

import { deserializePublicKey } from './deserialize-public-key'

export function publicKeyToETHAddress(publicKey: string): string {
  const key = deserializePublicKey(publicKey, {
    compress: false,
  })
  const address = ethers.computeAddress(key)

  return address
}
