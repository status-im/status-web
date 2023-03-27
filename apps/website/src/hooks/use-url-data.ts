// todo?: rename to use-encoded-url-data

import { useEffect, useState } from 'react'

import { deserializePublicKey, verifyEncodedURLData } from '@status-im/js'

import type { ERROR_CODES } from '@/consts/error-codes'
import type { ChannelInfo, CommunityInfo, UserInfo } from '@status-im/js'

export const useURLData = <T extends CommunityInfo | ChannelInfo | UserInfo>(
  unverifiedDecodedData: T | undefined,
  unverifiedEcodedData: string | undefined
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

      if (!unverifiedDecodedData || !unverifiedEcodedData) {
        // todo?: extend spec for more than just public key after # (e.i. ens name, signature)
        // todo?: encode it
        const hash = window.location.hash.replace('#', '')
        try {
          const publicKey = deserializePublicKey(hash)

          setPublicKey(publicKey)
        } catch (error) {
          setError('INVALID_PUBLIC_KEY')
        }
      } else {
        const [urlSignature, publicKey] = window.location.hash
          .replace('#', '')
          .split(';')

        if (!urlSignature || !publicKey) {
          setError('UNVERIFIED_CONTENT')
        } else if (
          !verifyEncodedURLData(urlSignature, unverifiedEcodedData, publicKey)
        ) {
          setError('UNVERIFIED_CONTENT')
        } else {
          const verifiedDecodedData = unverifiedDecodedData

          // fixme!: set only verified data
          // setVerifiedData(props.unverifiedData)
          setData(verifiedDecodedData)
          setPublicKey(deserializePublicKey(publicKey))
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
