import { describe, expect, test } from 'vitest'

import {
  decodeChannelURLData,
  decodeCommunityURLData,
  decodeUserURLData,
  encodeChannelURLData,
  encodeCommunityURLData,
  encodeUserURLData,
} from './encode-url-data'

import type { Channel } from '../protos/url_pb'
import type { PlainMessage } from '@bufbuild/protobuf'

describe('Encode URL data', () => {
  test('should encode and decode community', () => {
    const data = {
      displayName: 'Lorem ipsum dolor sit egestas.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
      membersCount: 1_000_000,
      color: '#4360DF',
      tagIndices: [1, 2, 3, 4],
    }

    const encodedData = encodeCommunityURLData(data)
    const decodedData = decodeCommunityURLData(encodedData)

    expect(encodedData).toBe(
      'G8QAgC0OzDOfHB4N5V1zajCKmHvbUAXB6XK6XYLS60WrOmCEEVgFEJaHsLkpTevR-XHc03r4B2pKTOoYJwqbLrLw9u2DhyzlK5rEWE09Dy7oPbVSPhwlOKozCQuAsMX84eJimcwKWNer82gPcCrbhPM-Zx1s3-glfEojrEYRDp61MM2DTNiD92_BDIN3eYvvcQsfT-quKYmaf1_i9Kpzk0Fi'
    )
    expect(decodedData).toEqual(data)
  })

  test('should encode and decode  channel', () => {
    const data = {
      emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      displayName: 'lorem-ipsum-dolore-nulla',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
      color: '#EAB700',
      uuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
      community: {
        displayName: 'Lorem ipsum dolor sit egestas.',
      },
    }

    const encodedData = encodeChannelURLData(
      data as unknown as PlainMessage<Channel>
    )
    const decodedData = decodeChannelURLData(encodedData)

    expect(encodedData).toBe(
      'GxoBQCwO7MbOG73h9C_ECmmNLFveFT5wVETFRTal3e2y0Xyou1sfFAV-SsZH0MTwwDRpTuEnp26giuDkQ9algElBJsdfwJYmFggG1GoJJJjnNgaO49Oj0C6qYIaxnbTEvF-6xH6jxmPg5oHSFAguuFhgFpIIby42hURPGM87X47XATSzJGec5_OsF9ZthVfGzWIIRgcltFjTBbPZTiKBcdj_5iQ5DTbPW4LaTsu46RK2OuuSPOXd-ddgstj0g6uYHm2WBUDBjYa1oPniW2ZdVpFpY-ubJq587eM-JytEhXc_Kuq8tiU='
    )
    expect(decodedData).toEqual(data)
  })

  test('should encode and decode user', () => {
    const data = {
      displayName: 'Lorem ipsum dolore nulla',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce finibus eleifend urna. Sed euismod tellus vel tellus interdum molestie. Maecenas ut fringilla dui. Duis auctor quis magna at congue. Duis euismod tempor pharetra. Morbi blandit.',
      color: '#EAB700',
    }

    const encodedData = encodeUserURLData(data)
    const decodedData = decodeUserURLData(encodedData)

    expect(encodedData).toBe(
      'GxgBoJwHdsOLl4DWt55mGELN6clGsb1UKTEkT0KUMDfwhWFpUyWH_cefTnvlcSf2JUXCOAWoY5ywzry-LnJ-PjgOGT1Pkb8riQp7ghv6Zu-x70x4m8lncZaRWpDN-sEfT85idUCWvppT_QFNa2A6J3Gr69UJGvWmL3S4DBwX2Jr7LBTNOvFPo6lejNUb-xizlAMUTrokunCH-qNmgtU6UK0J6Vkn8Ce35XGBFObxpxnAtnC_J_D-SrBCBnjiUlwH0ViNr3lHBg=='
    )
    expect(decodedData).toEqual(data)
  })
})
