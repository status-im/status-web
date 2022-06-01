// export { Chat } from './chat'
// // export type { Client, ClientOptions } from './client'
// export { createClient } from './client'
// export { Community } from './community'
// export { Contacts } from './contacts'
// export type { GroupChat, GroupChatsType } from './groupChats'
// export { GroupChats } from './groupChats'
// export { Identity } from './identity'
// export { Messenger } from './messenger'
// export {
//   bufToHex,
//   compressPublicKey,
//   genPrivateKeyWithEntropy,
//   getLatestUserNickname,
//   hexToBuf,
// } from './utils'
// export { ApplicationMetadataMessage } from './wire/application_metadata_message'
// export type {
//   AudioContent,
//   Content,
//   ContentType,
//   ImageContent,
//   StickerContent,
//   TextContent,
// } from './wire/chat_message'
// export { ChatMessage } from './wire/chat_message'
// export { getPredefinedBootstrapNodes } from 'js-waku'

import { createClient } from './client-v2'

const COMMUNITY_PUBLIC_KEY =
  '0x029dd5fecbd689dc11e2a5b399afed92cf1fab65d315b883efca753e8f3882f3bd' // compressed
// const COMMUNITY_PUBLIC_KEY =
//   '0x0403aeff2fdd0044b136e06afa6d69bb563bb7b3fd518bb30c0d5115a2e020840a2247966c2cc9953ed02cc391e8883b3319f63a31e5f5369d0fb72b62b23dfcbd' // compressed

// import { Community } from '../src/community'
// import { Messenger } from '../src/messenger'

console.log('🚀 > COMMUNITY_PUBLIC_KEY', COMMUNITY_PUBLIC_KEY)
;(async () => {
  const client = await createClient({
    env: 'test',
    publicKey: COMMUNITY_PUBLIC_KEY,
    callback: msgs => {},
  })

  const communityDescription = await client.getCommunityDescription()

  console.log('meow', communityDescription)

  // console.log(communityDescription)
  // Retrieve Community's metadata (e.g. description)
  // const community = await Community.instantiateCommunity(COMMUNITY_PUBLIC_KEY, client)
  // // Retrieve and subscribe to messages
  // const messenger = await Messenger.create(, client)
  // // TODO: Register observers/callbacks
  // messenger.addObserver(() => {})
  // await client.stop()
})()

// export {}
