import { describe, expect, test } from 'vitest'

import {
  createChannelURLWithData,
  createChannelURLWithPublicKey,
  createCommunityURLWithData,
  createCommunityURLWithPublicKey,
  createUserURLWithData,
  createUserURLWithPublicKey,
} from './create-url'

describe('Create URLs', () => {
  test('should create community URL', () => {
    expect(
      createCommunityURLWithPublicKey(
        'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
      ).toString()
    ).toBe(
      'https://status.app/c#zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
    )
    expect(
      createCommunityURLWithData(
        'G74AgK0ObFNmYT-WC_Jcc9KfSjHXAQo9THKEEbgPaJoItceMES-bUxr2Tj9efv447rRefBIUg9CEsSFyjBOFTRdZ9PH2wUOW8hVNYqIje3BC96mZ8uFogqM6k7gCCJnMHy4ulsmsgHTdeh5dAzTNNuG8m9XB8oVeildTCKlRhINnTZh4kAl5sP8SzBB4V2_I41a8PKl3mcS0z_eF5gA=',
        'Co0BClhrLW43ZC05UGN4Nmh0ODdGNHJpUDV4QXcxdjdTLWUxSEdNUmFlYU8wNjhRM0lGMUpvOHhPeWVNVDlZcjNXdjM0OVoyQ2RCenlsdzhNODNDZ1FoY01vZ0E9EjF6UTNzaFVIcDJyQU0xeXFCWWVvNkxoRmJ0cm96RzVtWmVBNmNSb0dvaHN1ZHRzaWVU'
      ).toString()
    ).toBe(
      'https://status.app/c/G74AgK0ObFNmYT-WC_Jcc9KfSjHXAQo9THKEEbgPaJoItceMES-bUxr2Tj9efv447rRefBIUg9CEsSFyjBOFTRdZ9PH2wUOW8hVNYqIje3BC96mZ8uFogqM6k7gCCJnMHy4ulsmsgHTdeh5dAzTNNuG8m9XB8oVeildTCKlRhINnTZh4kAl5sP8SzBB4V2_I41a8PKl3mcS0z_eF5gA=#XjSijLHYvRAvZObDIYMDQlZkusbqn8EThTroHTSfBXECkp5VQ-xgYNttkhcAjQEeFLu1zFJEFhrQ6M5dNHeUOQA='
    )
  })

  test('should create channel URL', () => {
    expect(
      createChannelURLWithPublicKey(
        '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
        'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
      ).toString()
    ).toBe(
      'https://status.app/cc/30804ea7-bd66-4d5d-91eb-b2dcfe2515b3#zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'
    )
    expect(
      createChannelURLWithData(
        'G70BYJwHdqxloHnQV-SSlY7OfdEB_f8igUIHtomMR1igUTaaRSFVBhJ-mjSn8BPqdBHk0PiHrEsBk8WBTo6_gK0tSiwQDLCWpwnmKeU2Bo7j005CuygCCwWebictMe-XLrHfyPEUmLllOKoRCBtcLDALSYQvF5NCoieM550vx-sAmlmSK871edYL67bCK-PPYghGByWEGNMFs9lOIoFx2H_mJDkNNs9bYsbbaRl_uoStzrokUn0u578yAg16mYwLh-287482y4Ibg9640rAW9JNkrfwstJ2qbLLXJ2CYUOa5ftZlFZk2TnzTxIGvfdznZLVXePelos5rWwI=',
        'Co0BClhrLW43ZC05UGN4Nmh0ODdGNHJpUDV4QXcxdjdTLWUxSEdNUmFlYU8wNjhRM0lGMUpvOHhPeWVNVDlZcjNXdjM0OVoyQ2RCenlsdzhNODNDZ1FoY01vZ0E9EjF6UTNzaFVIcDJyQU0xeXFCWWVvNkxoRmJ0cm96RzVtWmVBNmNSb0dvaHN1ZHRzaWVU'
      ).toString()
    ).toBe(
      'https://status.app/cc/G70BYJwHdqxloHnQV-SSlY7OfdEB_f8igUIHtomMR1igUTaaRSFVBhJ-mjSn8BPqdBHk0PiHrEsBk8WBTo6_gK0tSiwQDLCWpwnmKeU2Bo7j005CuygCCwWebictMe-XLrHfyPEUmLllOKoRCBtcLDALSYQvF5NCoieM550vx-sAmlmSK871edYL67bCK-PPYghGByWEGNMFs9lOIoFx2H_mJDkNNs9bYsbbaRl_uoStzrokUn0u578yAg16mYwLh-287482y4Ibg9640rAW9JNkrfwstJ2qbLLXJ2CYUOa5ftZlFZk2TnzTxIGvfdznZLVXePelos5rWwI=#XjSijLHYvRAvZObDIYMDQlZkusbqn8EThTroHTSfBXECkp5VQ-xgYNttkhcAjQEeFLu1zFJEFhrQ6M5dNHeUOQA='
    )
  })

  test('should create user URL', () => {
    expect(
      createUserURLWithPublicKey(
        'zQ3shUHp2rAM1yqBYeo6LhFbtrozG5mZeA6cRoGohsudtsieT'
      ).toString()
    ).toBe(
      'https://status.app/u#zQ3shUHp2rAM1yqBYeo6LhFbtrozG5mZeA6cRoGohsudtsieT'
    )
    expect(
      createUserURLWithData(
        'GxgBoJwHdsOLl4DWt55mGELN6clGsb1UKTEkT0KUMDfwhWFpUyWH_cefTnvlcSf2JUXCOAWoY5ywzry-LnJ-PjgOGT1Pkb8riQp7ghv6Zu-x70x4m8lncZaRWpDN-sEfT85idUCWvppT_QFNa2A6J3Gr69UJGvWmL3S4DBwX2Jr7LBTNOvFPo6lejNUb-xizlAMUTrokunCH-qNmgtU6UK0J6Vkn8Ce35XGBFObxpxnAtnC_J_D-SrBCBnjiUlwH0ViNr3lHBg==',
        'Co0BClhrLW43ZC05UGN4Nmh0ODdGNHJpUDV4QXcxdjdTLWUxSEdNUmFlYU8wNjhRM0lGMUpvOHhPeWVNVDlZcjNXdjM0OVoyQ2RCenlsdzhNODNDZ1FoY01vZ0E9EjF6UTNzaFVIcDJyQU0xeXFCWWVvNkxoRmJ0cm96RzVtWmVBNmNSb0dvaHN1ZHRzaWVU'
      ).toString()
    ).toBe(
      'https://status.app/u/GxgBoJwHdsOLl4DWt55mGELN6clGsb1UKTEkT0KUMDfwhWFpUyWH_cefTnvlcSf2JUXCOAWoY5ywzry-LnJ-PjgOGT1Pkb8riQp7ghv6Zu-x70x4m8lncZaRWpDN-sEfT85idUCWvppT_QFNa2A6J3Gr69UJGvWmL3S4DBwX2Jr7LBTNOvFPo6lejNUb-xizlAMUTrokunCH-qNmgtU6UK0J6Vkn8Ce35XGBFObxpxnAtnC_J_D-SrBCBnjiUlwH0ViNr3lHBg==#YK_4DvgJIE8NK4q21xmKu7z2hce-cOqiY7X4DYhCQSVqbOWfCkXxMoZ6iqs-_MVNfU2hOnIayF0z_3F_hJqRpAE='
    )
  })
})
