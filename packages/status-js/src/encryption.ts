import pbkdf2 from 'pbkdf2'

const AESKeyLength = 32 // bytes

export function createSymKeyFromPassword(password: string): Uint8Array {
  return pbkdf2.pbkdf2Sync(
    Buffer.from(password, 'utf-8'),
    '',
    65356,
    AESKeyLength,
    'sha256'
  )
}
