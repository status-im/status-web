import { expect } from 'chai'
import { getCommunityDetailsSync } from '../src/helpers/apiMock'
import { communities } from '../src/helpers/apiMockData'

describe('getCommunityDetails', () => {
  it('success', async () => {
    expect(getCommunityDetailsSync('0x0d9cb350e1dc415303e2816a21b0a439530725b4b2b42d2948e967cb211eab89d5')).to.deep.eq(
      communities[0],
    )
  })
  it('gets different community', async () => {
    expect(getCommunityDetailsSync('0x9ac2b2e23eb62fa70fc7f31c0895ac46230c241e')).to.deep.eq(communities[1])
  })
  it('empty', async () => {
    expect(getCommunityDetailsSync('0xabA1eF51ef4bc360a9e8C9aD2d787330B6q2eb24')).to.deep.eq(undefined)
  })
})
