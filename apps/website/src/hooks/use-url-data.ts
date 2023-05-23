// todo?: rename to use-encoded-url-data, url-params

import { useEffect, useState } from 'react'

import { deserializePublicKey, verifyEncodedURLData } from '@status-im/js'
import { decodeVerificationURLHash } from '@status-im/js/encode-url-hash'

import type { ERROR_CODES } from '@/consts/error-codes'
import type { ChannelInfo, CommunityInfo, UserInfo } from '@status-im/js'

export const useURLData = <T extends CommunityInfo | ChannelInfo | UserInfo>(
  unverifiedDecodedData: T | undefined | null,
  unverifiedEncodedData: string | undefined | null,
  compress: boolean
) => {
  // todo: unify pk under class (e.g. for user fetching)
  const [publicKey, setPublicKey] = useState<string>()
  // todo?: rename data to content
  const [data, setData] = useState<T>()
  const [error, setError] = useState<keyof typeof ERROR_CODES>()

  useEffect(() => {
    try {
      // todo: set constrains on url data (e.g. max lenght, byte)
      // todo: decoded url data againts schema (e.g. length)
      // if (/* invalid schema */) {
      //   return
      // }

      if (!unverifiedDecodedData || !unverifiedEncodedData) {
        // todo?: extend spec for more than just public key after # (e.i. ens name, signature)
        const hash = window.location.hash.replace('#', '')

        if (!hash) {
          setError('NOT_FOUND')

          return
        }

        try {
          const publicKey = deserializePublicKey(hash, { compress })

          setPublicKey(publicKey)
        } catch (error) {
          setError('INVALID_PUBLIC_KEY')
        }
      } else {
        const hash = window.location.hash
        const { signature, publicKey } = decodeVerificationURLHash(hash)

        if (!signature || !publicKey) {
          setError('UNVERIFIED_CONTENT')
        } else if (!verifyEncodedURLData(unverifiedEncodedData, hash)) {
          setError('UNVERIFIED_CONTENT')
        } else {
          const verifiedDecodedData = unverifiedDecodedData

          setData(verifiedDecodedData)
          setPublicKey(deserializePublicKey(publicKey, { compress }))
        }
      }
    } catch (error) {
      setError('INTERNAL_SERVER_ERROR')
    }
  }, [])

  return {
    publicKey,
    verifiedURLData: data,
    error,
  }
}
