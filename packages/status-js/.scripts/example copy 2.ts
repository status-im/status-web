import { createClient } from '../src/client'

import { Community } from '../src/community'
// import { Messenger } from '../src/messenger'

const COMMUNITY_PUBLIC_KEY =
  '0x029dd5fecbd689dc11e2a5b399afed92cf1fab65d315b883efca753e8f3882f3bd' // compressed

;(async () => {
  const client = await createClient()

  // Community (e.g. description, channels, channel messages)
  const community = await Community.instantiateCommunity(
    COMMUNITY_PUBLIC_KEY,
    client
  )

  // // Messenger/Messages (e.g. direct messages)
  // const messenger = await Messenger.create(, client)
  // // TODO: Register observers/callbacks
  // messenger.addObserver(() => {})

  await client.stop()
})()
