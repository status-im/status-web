import { utf8ToBytes } from 'ethereum-cryptography/utils'
import { pbkdf2 } from 'pbkdf2'

const AESKeyLength = 32 // bytes

export async function createSymKeyFromPassword(
  password: string
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    pbkdf2(
      utf8ToBytes(password),
      '',
      65356,
      AESKeyLength,
      'sha256',
      (err, buf) => {
        if (err) {
          reject(err)
        } else {
          resolve(buf)
        }
      }
    )
  })
}
