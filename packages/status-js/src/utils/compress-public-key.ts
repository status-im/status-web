import * as secp from 'ethereum-cryptography/secp256k1'

export function compressPublicKey(publicKey: string): string {
  try {
    const pk = publicKey.replace(/^0[xX]/, '') // ensures hexadecimal digits without "base prefix"
    return secp.Point.fromHex(pk).toHex(true)
  } catch (error) {
    throw new Error('Invalid public key')
  }
}
