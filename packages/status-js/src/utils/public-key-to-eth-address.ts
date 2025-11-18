import { ethers } from 'ethers'

import { deserializePublicKey } from './deserialize-public-key'

export function publicKeyToETHAddress(publicKey: string): string {
  const key = deserializePublicKey(publicKey, {
    compress: false,
  })
  const address =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ethers as any).utils?.computeAddress?.(key) ?? ethers.computeAddress(key)

  return address
}
