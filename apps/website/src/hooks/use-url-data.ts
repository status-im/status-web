// todo?: rename to use-encoded-url-data, url-params

import { useEffect, useState } from 'react'

import {
  deserializePublicKey,
  indicesToTags,
  publicKeyToColorHash,
  publicKeyToEmojiHash,
  verifyEncodedURLData,
} from '@status-im/js'
import { decodeVerificationURLHash } from '@status-im/js/encode-url-hash'

import { ERROR_CODES } from '@/consts/error-codes'

import type { VerifiedData } from '@/components/preview-page'
import type { ChannelInfo, CommunityInfo, UserInfo } from '@status-im/js'
import type {
  decodeChannelURLData,
  decodeCommunityURLData,
  decodeUserURLData,
} from '@status-im/js/encode-url-data'

export const useURLData = (
  type: 'community' | 'channel' | 'profile',
  unverifiedDecodedData:
    | ReturnType<typeof decodeCommunityURLData>
    | ReturnType<typeof decodeChannelURLData>
    | ReturnType<typeof decodeUserURLData>
    | undefined
    | null,
  unverifiedEncodedData: string | undefined | null
) => {
  const [publicKey, setPublicKey] = useState<string>()
  const [channelUuid, setChannelUuid] = useState<string>()
  const [info, setInfo] = useState<VerifiedData>()
  const [error, setError] = useState<keyof typeof ERROR_CODES>()

  const compressPublicKey = type !== 'profile'

  useEffect(() => {
    try {
      // todo: set constrains on url data (e.g. max lenght, byte)
      // todo: decoded url data againts schema (e.g. length)
      // if (/* invalid schema */) {
      //   return
      // }

      if (!unverifiedDecodedData || !unverifiedEncodedData) {
        const hash = window.location.hash.replace('#', '')

        if (!hash) {
          setError('NOT_FOUND')

          return
        }

        try {
          const publicKey = deserializePublicKey(hash, {
            compress: compressPublicKey,
          })

          setPublicKey(publicKey)
        } catch (error) {
          console.error(error)
          setError('INVALID_PUBLIC_KEY')
        }

        return
      }

      const hash = window.location.hash.replace('#', '')
      const { signature, publicKey } = decodeVerificationURLHash(hash)

      if (!signature || !publicKey) {
        setError('UNVERIFIED_CONTENT')

        return
      }

      if (!verifyEncodedURLData(unverifiedEncodedData, hash)) {
        setError('UNVERIFIED_CONTENT')

        return
      }

      const deserializedPublicKey = deserializePublicKey(publicKey, {
        compress: compressPublicKey,
      })

      const verifiedDecodedData = unverifiedDecodedData
      switch (type) {
        case 'community': {
          const data = verifiedDecodedData as Required<
            ReturnType<typeof decodeCommunityURLData>
          >
          const info: CommunityInfo = {
            displayName: data.displayName,
            description: data.description,
            color: data.color,
            membersCount: data.membersCount,
            tags: indicesToTags(data.tagIndices),
          }

          setInfo({ type: 'community', info })

          break
        }
        case 'channel': {
          const data = verifiedDecodedData as Required<
            ReturnType<typeof decodeChannelURLData>
          >
          const info: Omit<ChannelInfo, 'community'> & {
            community: Pick<ChannelInfo['community'], 'displayName'>
          } = {
            displayName: data.displayName,
            description: data.description,
            color: data.color,
            emoji: data.emoji,
            community: { displayName: data.community.displayName },
          }

          setInfo({ type: 'channel', info })
          setChannelUuid(data.uuid)

          break
        }
        case 'profile': {
          const data = verifiedDecodedData as Required<
            ReturnType<typeof decodeUserURLData>
          >
          const info: UserInfo = {
            displayName: data.displayName,
            description: data.description,
            colorHash: publicKeyToColorHash(deserializedPublicKey),
            emojiHash: publicKeyToEmojiHash(deserializedPublicKey),
          }

          setInfo({ type: 'profile', info })

          break
        }
      }

      setPublicKey(deserializedPublicKey)
    } catch (error) {
      console.error(error)
      setError('INTERNAL_SERVER_ERROR')
    }
  }, [])

  return {
    publicKey,
    channelUuid,
    verifiedURLData: info,
    errorCode: error ? ERROR_CODES[error] : undefined,
  }
}
