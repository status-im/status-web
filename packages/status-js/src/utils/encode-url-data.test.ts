import { describe, expect, test } from 'vitest'

import {
  decodeChannelUrlData,
  decodeCommunityUrlData,
  decodeUserUrlData,
  encodeChannelUrlData,
  encodeCommunityUrlData,
  encodeUserUrlData,
} from './encode-url-data'

describe('URL data', () => {
  test('should encode and decode community', () => {
    const data = {
      displayName: 'Lorem ipsum dolor sit egestas.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
      membersCount: 1_000_000,
      color: '#4360DF',
    }

    const encodedData = encodeCommunityUrlData(data)
    const decodedData = decodeCommunityUrlData(encodedData)

    expect(encodedData).toBe(
      'G74AgK0ObFNmYT-WC_Jcc9KfSjHXAQo9THKEEbgPaJoItceMES-bUxr2Tj9efv447rRefBIUg9CEsSFyjBOFTRdZ9PH2wUOW8hVNYqIje3BC96mZ8uFogqM6k7gCCJnMHy4ulsmsgHTdeh5dAzTNNuG8m9XB8oVeildTCKlRhINnTZh4kAl5sP8SzBB4V2_I41a8PKl3mcS0z_eF5gA='
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
      community: {
        displayName: 'Lorem ipsum dolor sit egestas.',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
      },
    }

    const encodedData = encodeChannelUrlData(data)
    const decodedData = decodeChannelUrlData(encodedData)

    expect(encodedData).toBe(
      'G5EBYCwOMrkec8PbsvkGVxRnInqDN3deAUebRefR-VRkKX2Lwov4MpDwMxkfQRPD49F0k4Sf-ry6-Afpu3HhmwAlpZ1Ojr8DW1uUWCAYYC2BBPOUchsDx3HqUWgXZfSxrjPnLLpPztKMUqbA5QIbjyA2OBqQyfjhy8ViMNIhTbeeR1cHh0a94twfIw-WLbRUvBpCSPYkSozlxBBzMiAP9l-c4QJrahWt-a14eULvHDnr13hu-7cAPSZdhQuX5KrK8tCyzB3qBTf2taCfNIs_d5HkynMDq6wB'
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

    const encodedData = encodeUserUrlData(data)
    const decodedData = decodeUserUrlData(encodedData)

    expect(encodedData).toBe(
      'GxgBoJwHdsOLl4DWt55mGELN6clGsb1UKTEkT0KUMDfwhWFpUyWH_cefTnvlcSf2JUXCOAWoY5ywzry-LnJ-PjgOGT1Pkb8riQp7ghv6Zu-x70x4m8lncZaRWpDN-sEfT85idUCWvppT_QFNa2A6J3Gr69UJGvWmL3S4DBwX2Jr7LBTNOvFPo6lejNUb-xizlAMUTrokunCH-qNmgtU6UK0J6Vkn8Ce35XGBFObxpxnAtnC_J_D-SrBCBnjiUlwH0ViNr3lHBg=='
    )
    expect(decodedData).toEqual(data)
  })
})
