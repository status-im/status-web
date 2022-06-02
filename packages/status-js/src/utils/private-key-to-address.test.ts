import { privateKeyToAddress } from './private-key-to-address'

describe('privateKeyToAddress', () => {
  it('should return public address', () => {
    const privateKey =
      '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709'
    const address = privateKeyToAddress(privateKey)
    expect(address).toEqual('0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01')
  })
})
