import { describe, expect, test } from 'vitest'

import { createChannelURL, createCommunityURL } from './create-url'

describe('URL', () => {
  test('should create community URL', () => {
    expect(
      createCommunityURL(
        'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
      ).toString()
    ).toBe(
      'https://status.app/c#zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
    )
    expect(
      createCommunityURL(
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
      createChannelURL(
        '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
        'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
      ).toString()
    ).toBe(
      'https://status.app/cc/30804ea7-bd66-4d5d-91eb-b2dcfe2515b3#zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
    )
    expect(
      createChannelURL(
        'G70BYJwHdqxloHnQV-SSlY7OfdEB_f8igUIHtomMR1igUTaaRSFVBhJ-mjSn8BPqdBHk0PiHrEsBk8WBTo6_gK0tSiwQDLCWpwnmKeU2Bo7j005CuygCCwWebictMe-XLrHfyPEUmLllOKoRCBtcLDALSYQvF5NCoieM550vx-sAmlmSK871edYL67bCK-PPYghGByWEGNMFs9lOIoFx2H_mJDkNNs9bYsbbaRl_uoStzrokUn0u578yAg16mYwLh-287482y4Ibg9640rAW9JNkrfwstJ2qbLLXJ2CYUOa5ftZlFZk2TnzTxIGvfdznZLVXePelos5rWwI=',
        new Uint8Array([
          94, 52, 162, 140, 177, 216, 189, 16, 47, 100, 230, 195, 33, 131, 3,
          66, 86, 100, 186, 198, 234, 159, 193, 19, 133, 58, 232, 29, 52, 159,
          5, 113, 2, 146, 158, 85, 67, 236, 96, 96, 219, 109, 146, 23, 0, 141,
          1, 30, 20, 187, 181, 204, 82, 68, 22, 26, 208, 232, 206, 93, 52, 119,
          148, 57, 0,
        ])
      ).toString()
    ).toBe(
      'https://status.app/cc/G70BYJwHdqxloHnQV-SSlY7OfdEB_f8igUIHtomMR1igUTaaRSFVBhJ-mjSn8BPqdBHk0PiHrEsBk8WBTo6_gK0tSiwQDLCWpwnmKeU2Bo7j005CuygCCwWebictMe-XLrHfyPEUmLllOKoRCBtcLDALSYQvF5NCoieM550vx-sAmlmSK871edYL67bCK-PPYghGByWEGNMFs9lOIoFx2H_mJDkNNs9bYsbbaRl_uoStzrokUn0u578yAg16mYwLh-287482y4Ibg9640rAW9JNkrfwstJ2qbLLXJ2CYUOa5ftZlFZk2TnzTxIGvfdznZLVXePelos5rWwI=#XjSijLHYvRAvZObDIYMDQlZkusbqn8EThTroHTSfBXECkp5VQ-xgYNttkhcAjQEeFLu1zFJEFhrQ6M5dNHeUOQA='
    )
  })
})
