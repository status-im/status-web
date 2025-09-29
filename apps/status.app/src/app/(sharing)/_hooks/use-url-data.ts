// todo?: rename to use-encoded-url-data, url-params

import { useEffect, useState } from 'react'

import {
  deserializePublicKey,
  indicesToTags,
  publicKeyToColorHash,
  publicKeyToEmojiHash,
} from '@status-im/js'

import { ERROR_CODES } from '~sharing/_error-codes'

import type { ChannelInfo, CommunityInfo, UserInfo } from '@status-im/js'
import type {
  decodeChannelURLData,
  decodeCommunityURLData,
  decodeUserURLData,
} from '@status-im/js/encode-url-data'
import type { EnsResponse } from '~app/api/ens/route'
import type { Data } from '~sharing/_components/preview-page'

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
  const [url, setUrl] = useState<string>()

  const compressPublicKey = type !== 'profile'

  useEffect(() => {
    try {
      setUrl(window.location.href)

      const hash = window.location.hash.replace('#', '')

      // without encoded data

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
                next: {
                  revalidate: 600, // 10 minutes
                },
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

      // with encoded data

      // use provided public key
      let deserializedPublicKey
      try {
        deserializedPublicKey = deserializePublicKey(hash, {
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
            ...(data.tagIndices && { tags: indicesToTags(data.tagIndices) }),
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
    url,
  }
}
