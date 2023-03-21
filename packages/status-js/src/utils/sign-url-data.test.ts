import { describe, expect, test } from 'vitest'

import { signEncodedURLData, verifyEncodedURLData } from './sign-url-data'

import type { EncodedURLData } from './encode-url-data'

describe('Sign URL data', () => {
  const privateKey = new Uint8Array([
    233, 34, 68, 49, 2, 175, 16, 66, 41, 112, 38, 154, 139, 197, 117, 203, 223,
    215, 4, 135, 228, 217, 5, 31, 75, 9, 30, 221, 141, 239, 82, 84,
  ])

  test('should sign and verify URL data', async () => {
    const encodedURLData =
      'G74AgK0ObFNmYT-WC_Jcc9KfSjHXAQo9THKEEbgPaJoItceMES-bUxr2Tj9efv447rRefBIUg9CEsSFyjBOFTRdZ9PH2wUOW8hVNYqIje3BC96mZ8uFogqM6k7gCCJnMHy4ulsmsgHTdeh5dAzTNNuG8m9XB8oVeildTCKlRhINnTZh4kAl5sP8SzBB4V2_I41a8PKl3mcS0z_eF5gA=' as EncodedURLData

    const signature = await signEncodedURLData(encodedURLData, privateKey)

    expect(signature).toBe(
      'k-n7d-9Pcx6ht87F4riP5xAw1v7S-e1HGMRaeaO068Q3IF1Jo8xOyeMT9Yr3Wv349Z2CdBzylw8M83CgQhcMogA='
    )
    expect(verifyEncodedURLData(signature, encodedURLData)).toBe(true)
  })
})
