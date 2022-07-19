class Waku {
  libp2p
  store
  relay

  historyMessages = new Map() // Map<topic, message(s)>
  observers = new Map() // Map<topic, observers>

  constructor() {
    this.libp2p = {
      connectionManager: {
        connections: new Map(),
      },
    }
    this.store = {
      addDecryptionKey: () => {},
      queryHistory: (topics, { callback }) => {
        const messages = this.historyMessages.get(topics[0])

        if (messages) {
          callback(messages)
        }
      },
    }
    this.relay = {
      addDecryptionKey: () => {},
      addObserver: (observer, topics) => {
        topics.forEach(topic => {
          const _observer = this.observers.get(topic)

          if (_observer) {
            _observer.add(observer)
          } else {
            this.observers.set(topic, new Set().add(observer))
          }
        })
      },
      deleteObserver: undefined,
      send: undefined,
    }
  }

  // TODO?: async per type
  static create() {
    const waku = new Waku()

    return waku
  }

  async waitForRemotePeer() {}

  async stop() {}
}

const waku = Waku.create()

globalThis.waku = waku
