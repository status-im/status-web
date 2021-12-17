import { StoreCodec } from "js-waku";
import { Identity, Messenger } from "status-communities/dist/cjs";

const WAKU_OPTIONS = {
  libp2p: {
    config: {
      pubsub: {
        enabled: true,
        emitSelf: true,
      },
    },
  },
};

export async function createMessenger(identity: Identity | undefined) {
  const messenger = await Messenger.create(identity, WAKU_OPTIONS);
  await new Promise((resolve) => {
    messenger.waku.libp2p.peerStore.on("change:protocols", ({ protocols }) => {
      if (protocols.includes(StoreCodec)) {
        resolve("");
      }
    });
  });

  return messenger;
}
