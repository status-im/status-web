// todo?: rename to use-encoded-url-data, url-params

import { useEffect, useState } from 'react'

import {
  deserializePublicKey,
  indicesToTags,
  publicKeyToColorHash,
  publicKeyToEmojiHash,
  recoverPublicKeyFromEncodedURLData,
} from '@felicio/js'

import { ERROR_CODES } from '@/consts/error-codes'

import type { Data } from '@/components/preview-page'
import type { EnsResponse } from '@/pages/api/ens'
import type { ChannelInfo, CommunityInfo, UserInfo } from '@felicio/js'
import type {
  decodeChannelURLData,
  decodeCommunityURLData,
  decodeUserURLData,
} from '@felicio/js/encode-url-data'

export const useURLData = (
  type: 'community' | 'channel' | 'profile',
  decodedData:
    | ReturnType<typeof decodeCommunityURLData>
    | ReturnType<typeof decodeChannelURLData>
    | ReturnType<typeof decodeUserURLData>
    | undefined
    | null,
  encodedData: string | undefined | null
) => {
  const [publicKey, setPublicKey] = useState<string>()
  const [channelUuid, setChannelUuid] = useState<string>()
  const [data, setData] = useState<Data>()
  const [error, setError] = useState<keyof typeof ERROR_CODES>()
  const [isLoading, setIsLoading] = useState(false)

  const compressPublicKey = type !== 'profile'

  useEffect(() => {
    try {
      // todo: set constrains on url data (e.g. max lenght, byte)
      // todo: decoded url data againts schema (e.g. length)
      // if (/* invalid schema */) {
      //   return
      // }

      const hash = window.location.hash.replace('#', '')

      // use provided public key or recover it from ENS name
      if (!decodedData || !encodedData) {
        if (!hash) {
          setError('NOT_FOUND')

          return
        }

        // recover public key from ENS name
        const ensName = hash.match(/^.+\.eth$/)?.[0]
        if (ensName) {
          const fetchEnsPubkey = async () => {
            try {
              const response = await fetch('/api/ens', {
                method: 'POST',
                body: JSON.stringify({ ensName, compress: compressPublicKey }),
              })
              const { publicKey } = (await response.json()) as EnsResponse

              setPublicKey(publicKey)
            } catch {
              setError('INVALID_ENS_NAME')
            }

            setIsLoading(false)
          }

          setIsLoading(true)
          fetchEnsPubkey()

          return
        }

        // use provided public key
        try {
          const publicKey = deserializePublicKey(hash, {
            compress: compressPublicKey,
          })

          setPublicKey(publicKey)

          return
        } catch (error) {
          console.error(error)
          setError('INVALID_PUBLIC_KEY')

          return
        }
      }

      // recover public key from encoded data
      let deserializedPublicKey
      try {
        const recoveredPublicKey = recoverPublicKeyFromEncodedURLData(
          encodedData,
          hash
        )
        deserializedPublicKey = deserializePublicKey(recoveredPublicKey, {
          compress: compressPublicKey,
        })

        setPublicKey(deserializedPublicKey)
      } catch (error) {
        console.error(error)
        setError('INVALID_PUBLIC_KEY')

        return
      }

      // map data
      switch (type) {
        case 'community': {
          const data = decodedData as Required<
            ReturnType<typeof decodeCommunityURLData>
          >
          const info: CommunityInfo = {
            displayName: data.displayName,
            description: data.description,
            color: data.color,
            membersCount: data.membersCount,
            tags: indicesToTags(data.tagIndices),
          }

          setData({ type: 'community', info })

          return
        }
        case 'channel': {
          const data = decodedData as Required<
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

          setData({ type: 'channel', info })
          setChannelUuid(data.uuid)

          return
        }
        case 'profile': {
          const data = decodedData as Required<
            ReturnType<typeof decodeUserURLData>
          >
          const info: UserInfo = {
            displayName: data.displayName,
            description: data.description,
            colorHash: publicKeyToColorHash(deserializedPublicKey),
            emojiHash: publicKeyToEmojiHash(deserializedPublicKey),
          }

          setData({ type: 'profile', info })

          return
        }
      }
    } catch (error) {
      console.error(error)
      setError('INTERNAL_SERVER_ERROR')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    publicKey,
    channelUuid,
    data,
    errorCode: error ? ERROR_CODES[error] : undefined,
    isLoading,
  }
}
