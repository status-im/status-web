import { ethers } from 'ethers'

import { deserializePublicKey } from './deserialize-public-key'

export function publicKeyToETHAddress(publicKey: string): string {
  const key = deserializePublicKey(publicKey, {
    compress: false,
  })
  // Use bracket notation to prevent webpack from statically analyzing the export
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ethersAny = ethers as any
  const address =
    ethersAny.utils?.computeAddress?.(key) ?? ethersAny['computeAddress']?.(key)

  return address
}
