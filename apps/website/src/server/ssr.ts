import { ERROR_CODES } from '@/consts/error-codes'

import type {
  decodeChannelURLData,
  decodeCommunityURLData,
  decodeUserURLData,
} from '@status-im/js/encode-url-data'
import type { GetServerSideProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'

type DecodeType =
  | typeof decodeCommunityURLData
  | typeof decodeChannelURLData
  | typeof decodeUserURLData

export type ServerSideProps<T = ReturnType<DecodeType>> =
  | { errorCode: number }
  | {
      encodedData: string | null
      unverifiedData: T | null
    }

type Query = ParsedUrlQuery & {
  entity: string
  slug: string[]
}

export function createGetServerSideProps(decodeURLData: DecodeType) {
  const getServerSideProps: GetServerSideProps<
    ServerSideProps,
    Query
  > = async context => {
    try {
      const { params, res } = context

      // todo?: change route; c/[[data]]/index.tsx
      const encodedData = params!.slug?.[0]
      if (!encodedData) {
        const props: ServerSideProps = {
          encodedData: null,
          unverifiedData: null,
        }

        return { props }
      }

      const decodedData = decodeURLData(encodedData)
      const props: ServerSideProps = {
        encodedData: encodedData,
        unverifiedData: decodedData || null,
      }

      // fixme: set Cache-Control
      res.setHeader(
        'Cache-Control',
        'public, max-age=0, s-maxage=180, stale-while-revalidate=239'
        // 'public, max-age=0, s-maxage=1, stale-while-revalidate=900',
        // 'public, max-age=0, s-maxage=600, stale-while-revalidate=900',
        // 'public, s-maxage=10, stale-while-revalidate=59',
        // 'public, max-age=31536000, immutable',
      )

      return { props }
    } catch (error) {
      console.error(error)

      const props: ServerSideProps = {
        errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      }

      return { props }
    }
  }

  return getServerSideProps
}
