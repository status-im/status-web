import { getPredefinedBootstrapNodes, Waku } from 'js-waku'

// import { Fleet } from 'js-waku/build/main/lib/discovery/predefined'
// TOOD: params
// TODO?: reconnect/keep alive
// TODO?: error handling
// TOOD?: teardown
export async function createClient(): Promise<Waku> {
  // TODO?: set tiemout
  const waku = await Waku.create({
    bootstrap: {
      default: false,
      // peers: ['/dns4/node-01.gc-us-central1-a.wakuv2.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAmVkKntsECaYfefR1V2yCR79CegLATuTPE6B9TxgxBiiiA']
      peers: [
        '/dns4/node-01.gc-us-central1-a.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmJb2e28qLXxT5kZxVUUoJt72EMzNGXB47Rxx5hw3q4YjS',
      ],
    },
    // TODO?: remove
    libp2p: { config: { pubsub: { enabled: true, emitSelf: true } } },
  })
  await waku.waitForRemotePeer()
  return waku
}
