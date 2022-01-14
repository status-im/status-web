import { Identity, Messenger } from "@waku/status-communities/dist/cjs";
import { getBootstrapNodes, StoreCodec } from "js-waku";

function createWakuOptions(env: string) {
  let bootstrap: any = true;
  if (env === "test") {
    bootstrap = getBootstrapNodes.bind({}, [
      "fleets",
      "wakuv2.test",
      "waku-websocket",
    ]);
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
  };
}

export async function createMessenger(
  identity: Identity | undefined,
  env: string
) {
  const WAKU_OPTIONS = createWakuOptions(env);
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
