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
    const publicKey = 'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'

    const encodedData = encodeCommunityUrlData(data, publicKey)
    const decodedData = decodeCommunityUrlData(encodedData, publicKey)

    expect(encodedData).toBe(
      'G8QAgB2HsXukxPjOtKWIubcNl-B0uURsnKDo9aJV-0VzRbRGSUCoqm5G0xr2x3HvncEPqJXanmOcKGy6yMLbtw8espSvaBJj6QDp8OCCzq2V8uEqwVGdSfACIGwxf7i4WCazAtZ1dF_tAU5lm3De56yL7Ru9hE9phNUowsGzFqZ5kAl7cf4WzDB4lzebHo_w8aaempKoyas6hpxKbJ3d_wY='
    )
    expect(decodedData).toEqual(data)
  })

  test('should throw on invalid checksum for community encoded with incorrect public key', () => {
    expect(() => {
      const originalData = {
        displayName: 'Lorem ipsum dolor sit egestas.',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
      }
      const myPublicKey = 'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
      const notMypublicKey = 'zQ3shQkUHszVrsLxQ8ecNHfKg1P2W8EUnmZC7EWUVy6NbL6pa'

      const encodedData = encodeCommunityUrlData(originalData, notMypublicKey)
      decodeCommunityUrlData(encodedData, myPublicKey)
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid checksum"`)
  })

  test('should encode and decode channel', () => {
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
    const publicKey = 'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'

    const encodedData = encodeChannelUrlData(data, publicKey)
    const decodedData = decodeChannelUrlData(encodedData, publicKey)

    expect(encodedData).toBe(
      'G5cBYCwObGNU414kIfGJF_9oEekSbOhcKzocVYEWRdMIJ5IBGF9F7_-I1QczTbxMt1D4qWXqMj2Qvv9cWJMCpLTfMCo2RPMtKUgnx9-BrS1KLDB8SyDBPKXcxsBxnHoU2kUKmFBAxMs5iu6TozS0MgUprx6OPILY4GhABuOHLxeLwUiHNN16bp0dNI16xblvlgdzTbRUPBpCSPYkSozlgMlyMiA39l-c4YLVdFXEL8XDE3ql5agf5jNPz_-SHIEN9v4QLrwk5CBXp2HABQ_2taCfNFPe79z4IivOQxyros8='
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
    const publicKey = 'zQ3shUHp2rAM1yqBYeo6LhFbtrozG5mZeA6cRoGohsudtsieT'

    const encodedData = encodeUserUrlData(data, publicKey)
    const decodedData = decodeUserUrlData(encodedData, publicKey)

    expect(encodedData).toBe(
      'Gx4BoCwO7MYfC8gQlZtaVm-1qGLu0w2SUlWlMCSSEJ_6-6DhBl5hWNpUyWH_8afTXnnciX1JkTBOAVoSMI5xwrrzr4ucnw-OQ0bPU-TvSkoUc4Ib-mbvse9MeJvJZ3CWkVqQzfrBO56cxeqALH01p_oDmtZAd07iVterEzTqTV_ocBk4LrA191komnXin0ZTvRirN_YxZikHVjjpkujCHeqPmglW60C2JqRnncCf3JbHBVKYx59mANvC_Z7A-yvBChnYE5fiOojGa3zR8mhM3wQ='
    )
    expect(decodedData).toEqual(data)
  })
})
