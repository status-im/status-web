import { Messenger } from '@status-im/core'
import { getPredefinedBootstrapNodes } from 'js-waku'
import { Fleet } from 'js-waku/build/main/lib/discovery/predefined'
import { Protocols } from 'js-waku/build/main/lib/waku'

import type { Environment } from '../types/config'
import type { Identity } from '@status-im/core'
import type { CreateOptions } from 'js-waku/build/main/lib/waku'

function createWakuOptions(env: Environment): CreateOptions {
  let bootstrap: CreateOptions['bootstrap'] = {
    default: true,
  }

  if (env === 'test') {
    bootstrap = {
      peers: getPredefinedBootstrapNodes(Fleet.Test).map(a => a.toString()),
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
  env: Environment
) {
  const wakuOptions = createWakuOptions(env)
  const messenger = await Messenger.create(identity, wakuOptions)
  await messenger.waku.waitForRemotePeer([Protocols.Store])

  return messenger
}
