import { describe, expect, test } from 'vitest'

import {
  decodeChannelUrlData,
  decodeCommunityUrlData,
  decodeUserUrlData,
  encodeChannelUrlData,
  encodeCommunityUrlData,
  encodeUserUrlData,
} from './encode-url-data'

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

    const encodedData = encodeCommunityUrlData(data)
    const decodedData = decodeCommunityUrlData(encodedData)

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
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
        tagIndices: [1, 2, 3, 4],
      },
    }

    const encodedData = encodeChannelUrlData(data)
    const decodedData = decodeChannelUrlData(encodedData)

    expect(encodedData).toBe(
      'G70BYJwHdqxloHnQV-SSlY7OfdEB_f8igUIHtomMR1igUTaaRSFVBhJ-mjSn8BPqdBHk0PiHrEsBk8WBTo6_gK0tSiwQDLCWpwnmKeU2Bo7j005CuygCCwWebictMe-XLrHfyPEUmLllOKoRCBtcLDALSYQvF5NCoieM550vx-sAmlmSK871edYL67bCK-PPYghGByWEGNMFs9lOIoFx2H_mJDkNNs9bYsbbaRl_uoStzrokUn0u578yAg16mYwLh-287482y4Ibg9640rAW9JNkrfwstJ2qbLLXJ2CYUOa5ftZlFZk2TnzTxIGvfdznZLVXePelos5rWwI='
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
