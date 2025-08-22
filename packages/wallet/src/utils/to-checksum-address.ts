import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex, utf8ToBytes } from 'ethereum-cryptography/utils'

/**
 * Converts an Ethereum address to its checksummed version according to EIP-55.
 *
 * @param address - The Ethereum address to checksum (with or without 0x prefix)
 * @returns The checksummed address with 0x prefix
 *
 * @see https://eips.ethereum.org/EIPS/eip-55
 */
export function toChecksumAddress(address: string): string {
  const cleanAddress = address.toLowerCase().replace('0x', '')
  const hash = bytesToHex(keccak256(utf8ToBytes(cleanAddress)))
  let checksumAddress = '0x'

  for (let i = 0; i < cleanAddress.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksumAddress += cleanAddress[i].toUpperCase()
    } else {
      checksumAddress += cleanAddress[i]
    }
  }

  return checksumAddress
}
