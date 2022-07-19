// import { Waku } from './js-waku-mock'

// const fn = vi.fn()
// const fn = jest.fn()
// const fn = sinon.stub()

// export const Waku = {
//   // fn,
//   create: sinon.stub(),
// }

// todo?: use
// // @ts-expect-error
// globalThis.window.waku = Waku
// window.waku = Waku

// export const Waku = window.waku

// export default JsWakuMock

// const waku = Waku.create()
// console.log(waku)

// const date = new Date()

// // todo: try window, globalthis
// if (!globalThis.GlobalFoo) {
//   globalThis.GlobalFoo = () => console.log(date, date.getTime())
// } else {
//   console.log('ALREADYY')
// }

// if (GlobalFoo) {
//   GlobalFoo = () => console.log(date, date.getTime())
// } else {
//   console.log('ALREADY')
// }

class Waku {
  libp2p
  store
  relay

  historyMessages = new Map() // Map<topic, message(s)
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
            // this.observers.set(topic, new Set(observer))
            this.observers.set(topic, new Set().add(observer))
            // this.observers.set(topic, observer)
          }

          console.log(this.observers)
        })
      },
      deleteObserver: undefined,
      send: undefined,
    }
  }

  // todo?: async per type
  static create() {
    // if (!waku) {
    //   waku = new Waku()
    // }

    // if (!window.waku) {
    //   window.waku = waku
    // }

    // return window.waku
    const waku = new Waku()

    return waku
  }

  async waitForRemotePeer() {}

  async stop() {}

  foo() {
    console.log('foo')
  }
}

const waku = Waku.create()

globalThis.waku = waku
