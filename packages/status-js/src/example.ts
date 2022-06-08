// todo: delete
import { createClient } from '../src/client'

const COMMUNITY_PUBLIC_KEY =
  '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133' // Boring community
// '0x0243611cc13cc4e4390180fe8fd35234ab0fe2a7ba8d32e8ae5dd23b60ac7ec177'
// '0x02e7102c85ed78e5be30124f8f52014b1135f972c383f55f83ec8ff50436cd1260'
const CHANNEL_ID = '00d3f525-a0cf-4c40-832d-543ec9f8188b' // messages

;(async () => {
  const client = await createClient({ publicKey: COMMUNITY_PUBLIC_KEY })

  // client.community.onCommunityUpdate(() => console.log("community:update"))
  // client.community.onChannelUpdate(() => console.log("channel:update"))
  client.community.onChannelMessageUpdate(CHANNEL_ID, () =>
    console.log('channel:message')
  )

  // await client.stop()
})()
