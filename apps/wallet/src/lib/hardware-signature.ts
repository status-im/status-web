import { recoverAddress } from 'ethers'
import { hashMessage, hashTypedData, type Hex, keccak256 } from 'viem'

import type { HardwareSignRequest } from '@status-im/wallet/components'

function signedHash(request: HardwareSignRequest): Hex {
  switch (request.kind) {
    case 'personalMessage':
      return hashMessage({ raw: request.message })
    case 'typedData':
      return hashTypedData(JSON.parse(request.typedData))
    case 'transaction':
      return keccak256(request.serializedTx)
  }
}

/** Why `signature` is not `address`'s signature over `request`, or null. */
export function checkHardwareSignature(
  request: HardwareSignRequest,
  address: string,
  signature: string,
): string | null {
  let signer: string
  try {
    // ethers, because viem's recoverAddress is async and the scanner callback is not.
    signer = recoverAddress(signedHash(request), signature)
  } catch {
    return 'This QR code is not a signature for this request.'
  }

  if (signer.toLowerCase() !== address.toLowerCase()) {
    return `Signed by ${signer}, not by this account. Check that the device signs with this account.`
  }
  return null
}
