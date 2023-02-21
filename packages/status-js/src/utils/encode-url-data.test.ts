import { describe, expect, test } from 'vitest'

import {
  encodeChannelUrlData,
  encodeCommunityUrlData,
  encodeUserUrlData,
} from './encode-url-data'

// import type { Channel, Community, URLData, User } from '../protos/url-data_pb'
// import type { PlainMessage } from '@bufbuild/protobuf'

describe('encode-url-data', () => {
  test('community', () => {
    const encodedData = encodeCommunityUrlData(
      {
        displayName: 'Lorem ipsum dolor sit egestas.',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
      },
      'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
    )

    expect(encodedData).toBe(
      'G8QAgB2HsXukxPjOtKWIubcNl-B0uURsnKDo9aJV-0VzRbRGSUCoqm5G0xr2x3HvncEPqJXanmOcKGy6yMLbtw8espSvaBJj6QDp8OCCzq2V8uEqwVGdSfACIGwxf7i4WCazAtZ1dF_tAU5lm3De56yL7Ru9hE9phNUowsGzFqZ5kAl7cf4WzDB4lzebHo_w8aaempKoyas6hpxKbJ3d_wY='
    )
  })

  test('channel', () => {
    const encodedData = encodeChannelUrlData(
      {
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
      },
      'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
    )

    expect(encodedData).toBe(
      'G5cBYCwObGNU414kIfGJF_9oEekSbOhcKzocVYEWRdMIJ5IBGF9F7_-I1QczTbxMt1D4qWXqMj2Qvv9cWJMCpLTfMCo2RPMtKUgnx9-BrS1KLDB8SyDBPKXcxsBxnHoU2kUKmFBAxMs5iu6TozS0MgUprx6OPILY4GhABuOHLxeLwUiHNN16bp0dNI16xblvlgdzTbRUPBpCSPYkSozlgMlyMiA39l-c4YLVdFXEL8XDE3ql5agf5jNPz_-SHIEN9v4QLrwk5CBXp2HABQ_2taCfNFPe79z4IivOQxyros8='
    )
  })

  test('user', () => {
    const encodedData = encodeUserUrlData(
      {
        displayName: 'Lorem ipsum dolore nulla',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce finibus eleifend urna. Sed euismod tellus vel tellus interdum molestie. Maecenas ut fringilla dui. Duis auctor quis magna at congue. Duis euismod tempor pharetra. Morbi blandit.',
        color: '#EAB700',
      },
      'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
    )

    expect(encodedData).toBe(
      'Gx4BoKyOdxjDTkVw3ill9FQKCuu-schyrvM8wmIZ01IH8nmTC18YljZVcth__Om0Vx53Yl9SJIxTgJYEjGOcsO786yLn54PjkNHzFPm7khxZn-CGvtl77DsT3mbyGZxlpBZks35wx5OzWB2Qpa_mVH9A0xqozknc6np1gka96QsdLgPLBbbmPgtFs07802iqF2P1xj7GLOXACCddEl24Q_1RM8FqHYjWhPSsE_iT2_K4QArz-NMMYFu43xN4fyVYIQNz4lJcB9F4jS9JcyPtAw=='
    )
  })
})
