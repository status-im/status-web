import { Messenger } from '@status-im/core'
import { getNodesFromHostedJson } from 'js-waku'
import { Protocols } from 'js-waku/build/main/lib/waku'

import type { Identity } from '@status-im/core'

function createWakuOptions(env: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bootstrap: any = { default: true }

  if (env === 'test') {
    bootstrap = {
      getPeers: getNodesFromHostedJson.bind({}, [
        'fleets',
        'wakuv2.test',
        'waku-websocket',
      ]),
    }
  }
  return {
    bootstrap,
    libp2p: {
      config: {
        pubsub: {
          enabled: true,
          emitSelf: true,
        },
      },
    },
  }
}

export async function createMessenger(
  identity: Identity | undefined,
  env: string
) {
  const WAKU_OPTIONS = createWakuOptions(env)
  const messenger = await Messenger.create(identity, WAKU_OPTIONS)
  await messenger.waku.waitForRemotePeer([Protocols.Store])

  return messenger
}
