import { describe, expect, test } from 'vitest'

import { createChannelUrl, createCommunityUrl } from './create-url'

describe('URL', () => {
  test('should create community URL', () => {
    expect(
      createCommunityUrl(
        'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
      ).toString()
    ).toBe(
      'https://status.app/c#zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
    )
    expect(
      createCommunityUrl(
        'G74AgK0ObFNmYT-WC_Jcc9KfSjHXAQo9THKEEbgPaJoItceMES-bUxr2Tj9efv447rRefBIUg9CEsSFyjBOFTRdZ9PH2wUOW8hVNYqIje3BC96mZ8uFogqM6k7gCCJnMHy4ulsmsgHTdeh5dAzTNNuG8m9XB8oVeildTCKlRhINnTZh4kAl5sP8SzBB4V2_I41a8PKl3mcS0z_eF5gA=',
        new Uint8Array([
          94, 52, 162, 140, 177, 216, 189, 16, 47, 100, 230, 195, 33, 131, 3,
          66, 86, 100, 186, 198, 234, 159, 193, 19, 133, 58, 232, 29, 52, 159,
          5, 113, 2, 146, 158, 85, 67, 236, 96, 96, 219, 109, 146, 23, 0, 141,
          1, 30, 20, 187, 181, 204, 82, 68, 22, 26, 208, 232, 206, 93, 52, 119,
          148, 57, 0,
        ])
      ).toString()
    ).toBe(
      'https://status.app/c/G74AgK0ObFNmYT-WC_Jcc9KfSjHXAQo9THKEEbgPaJoItceMES-bUxr2Tj9efv447rRefBIUg9CEsSFyjBOFTRdZ9PH2wUOW8hVNYqIje3BC96mZ8uFogqM6k7gCCJnMHy4ulsmsgHTdeh5dAzTNNuG8m9XB8oVeildTCKlRhINnTZh4kAl5sP8SzBB4V2_I41a8PKl3mcS0z_eF5gA=#XjSijLHYvRAvZObDIYMDQlZkusbqn8EThTroHTSfBXECkp5VQ-xgYNttkhcAjQEeFLu1zFJEFhrQ6M5dNHeUOQA='
    )
  })

  test('should create channel URL', () => {
    expect(
      createChannelUrl(
        '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
        'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
      ).toString()
    ).toBe(
      'https://status.app/cc/30804ea7-bd66-4d5d-91eb-b2dcfe2515b3#zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
    )
    expect(
      createChannelUrl(
        '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
        'G5EBYCwOMrkec8PbsvkGVxRnInqDN3deAUebRefR-VRkKX2Lwov4MpDwMxkfQRPD49F0k4Sf-ry6-Afpu3HhmwAlpZ1Ojr8DW1uUWCAYYC2BBPOUchsDx3HqUWgXZfSxrjPnLLpPztKMUqbA5QIbjyA2OBqQyfjhy8ViMNIhTbeeR1cHh0a94twfIw-WLbRUvBpCSPYkSozlxBBzMiAP9l-c4QJrahWt-a14eULvHDnr13hu-7cAPSZdhQuX5KrK8tCyzB3qBTf2taCfNIs_d5HkynMDq6wB',
        new Uint8Array([
          94, 52, 162, 140, 177, 216, 189, 16, 47, 100, 230, 195, 33, 131, 3,
          66, 86, 100, 186, 198, 234, 159, 193, 19, 133, 58, 232, 29, 52, 159,
          5, 113, 2, 146, 158, 85, 67, 236, 96, 96, 219, 109, 146, 23, 0, 141,
          1, 30, 20, 187, 181, 204, 82, 68, 22, 26, 208, 232, 206, 93, 52, 119,
          148, 57, 0,
        ])
      ).toString()
    ).toBe(
      'https://status.app/cc/30804ea7-bd66-4d5d-91eb-b2dcfe2515b3/G5EBYCwOMrkec8PbsvkGVxRnInqDN3deAUebRefR-VRkKX2Lwov4MpDwMxkfQRPD49F0k4Sf-ry6-Afpu3HhmwAlpZ1Ojr8DW1uUWCAYYC2BBPOUchsDx3HqUWgXZfSxrjPnLLpPztKMUqbA5QIbjyA2OBqQyfjhy8ViMNIhTbeeR1cHh0a94twfIw-WLbRUvBpCSPYkSozlxBBzMiAP9l-c4QJrahWt-a14eULvHDnr13hu-7cAPSZdhQuX5KrK8tCyzB3qBTf2taCfNIs_d5HkynMDq6wB#XjSijLHYvRAvZObDIYMDQlZkusbqn8EThTroHTSfBXECkp5VQ-xgYNttkhcAjQEeFLu1zFJEFhrQ6M5dNHeUOQA='
    )
  })
})
