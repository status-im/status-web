import { ethers } from 'ethers'

import { deserializePublicKey } from './deserialize-public-key'

export function publicKeyToETHAddress(publicKey: string): string {
  const key = deserializePublicKey(publicKey, {
    compress: false,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const address = (ethers as any).utils.computeAddress(key)

  return address
}
