import { createClient } from '../src/client'

import { Community } from '../src/community'
// import { Messenger } from '../src/messenger'

const COMMUNITY_PUBLIC_KEY =
  '0x029dd5fecbd689dc11e2a5b399afed92cf1fab65d315b883efca753e8f3882f3bd' // compressed; A catchy name
// '0x02c788e419b56c714460220bedadc9c5d401ea10eee48d25ac81fc9a06fb75162e' // compressed; A boring name
// const COMMUNITY_CHANNEL_KEY = '0x029dd5fecbd689dc11e2a5b399afed92cf1fab65d315b883efca753e8f3882f3bd06935bce-a863-4827-9990-1652ae375c89' // 06935bce-a863-4827-9990-1652ae375c89; #channel
const COMMUNITY_CHANNEL_KEY = '6102c603-3246-4b90-986d-43c1b87b165f' // #random; UUID

;(async () => {
  const client = await createClient()

  // Community (e.g. name, description, permissions, members, channels, channel messages)
  const community = await Community.instantiateCommunity(
    COMMUNITY_PUBLIC_KEY,
    client
  )

  // // Messenger/Messages (e.g. direct messages)
  // const messenger = await Messenger.create(, client)

  // history

  await client.stop()
})()
