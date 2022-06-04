import { createClient } from '../src/client'

const COMMUNITY_PUBLIC_KEY =
  '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133' // Boring community
// '0x0243611cc13cc4e4390180fe8fd35234ab0fe2a7ba8d32e8ae5dd23b60ac7ec177'
// '0x02e7102c85ed78e5be30124f8f52014b1135f972c383f55f83ec8ff50436cd1260'
const CHANNEL_ID =
  // '00d3f525-a0cf-4c40-832d-543ec9f8188b' // #messages
  '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3' // #test-messages

// 0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133 c8b6df78-96be-4658-8bde-b51b2a09c599

;(async () => {
  const client = await createClient({ publicKey: COMMUNITY_PUBLIC_KEY })

  await client.start()
  await client.createAccount()

  const community = client.community.communityMetadata

  client.community.fetchChannelMessages(
    CHANNEL_ID,
    (messages, isDone) => {
      console.log(messages)

      return false
    },
    { start: new Date('2022-01-01'), end: new Date(), chunk: 3 }
  )
  // client.community.onCommunityUpdate(community => console.log(community))
  // client.community.onChannelUpdate(CHANNEL_ID, channel => console.log(channel))
  // client.community.onChannelMessageUpdate(CHANNEL_ID, messages =>
  //   console.log(messages)
  // )

  // await client.stop()
})()
