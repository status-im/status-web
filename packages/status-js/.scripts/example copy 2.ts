import { createClient } from "../src/client"

import { Community } from '../src/community'
import { Messenger } from '../src/messenger'

// const COMMUNITY_PUBLIC_KEY = '0x02cf13719c8b836bebd4e430c497ee38e798a43e4d8c4760c34bbd9bf4f2434d26'
const COMMUNITY_PUBLIC_KEY = '0x029dd5fecbd689dc11e2a5b399afed92cf1fab65d315b883efca753e8f3882f3bd' // compressed

;(async () => {
  const client = await createClient()

  // Retrieve Community's metadata (e.g. description)
  const community = await Community.instantiateCommunity(COMMUNITY_PUBLIC_KEY, client) // decoded protobuf

  // // Retrieve and subscribe to messages
  // const messenger = await Messenger.create(, client)
  // // TODO: Register observers/callbacks
  // messenger.addObserver(() => {})

  await client.stop()
})()
