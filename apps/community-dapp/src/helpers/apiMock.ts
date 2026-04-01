import { communities } from './apiMockData'

export function getCommunityDetailsSync(publicKey: string) {
  return communities.filter((community) => community.publicKey == publicKey)[0]
}

export async function getCommunityDetails(publicKey: string) {
  await new Promise((r) => setTimeout(r, 3000))
  return getCommunityDetailsSync(publicKey)
}
