/**
 * source: @see https://fleets.status.im
 */

// note!: users may experience additional latency due to cross-regional connection
// todo: use "dynamic" discovery protocol instead
// todo?: use a regional map together with an environment variable for the peer selection (e.g. `VERCEL_REGION`, but probably limited to  Serverless Functions)
export const peers = {
  production: [
    // Nim
    '/dns4/node-01.ac-cn-hongkong-c.status.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAkvEZgh3KLwhLwXg95e5ojM8XykJ4Kxi2T7hk22rnA7pJC',
    '/dns4/node-01.do-ams3.status.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAm6HZZr7aToTvEBPpiys4UxajCTU97zj5v7RNR2gbniy1D',
    '/dns4/node-01.gc-us-central1-a.status.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAkwBp8T6G77kQXSNMnxgaMky1JeyML5yqoTHRM8dbeCBNb',
    '/dns4/node-02.ac-cn-hongkong-c.status.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAmFy8BrJhCEmCYrUfBdSNkrPw6VHExtv4rRp1DSBnCPgx8',
    '/dns4/node-02.do-ams3.status.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAmSve7tR5YZugpskMv2dmJAsMUKmfWYEKRXNUxRaTCnsXV',
    '/dns4/node-02.gc-us-central1-a.status.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAmDQugwDHM3YeUp86iGjrUvbdw3JPRgikC7YoGBsT2ymMg',
    // Go
    // '/dns4/node-01.ac-cn-hongkong-c.go-waku.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAkwUKwy66nhcSFeW7y5qijNqXC4ZD3TaMMqnoEbh3wK2xU',
    // '/dns4/node-01.do-ams3.go-waku.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAkyScd7DiwgMwzfw8CFFhznH3wRzciqEUfjDzn7vyimR8c',
    // '/dns4/node-01.gc-us-central1-a.go-waku.prod.statusim.net/tcp/443/wss/p2p/16Uiu2HAmKTYnoPKebjWy63e1zPKiYRCQvm25W5mNSnCFE8EmzLga',
  ],
  test: [
    // Nim
    '/dns4/node-01.ac-cn-hongkong-c.status.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAm2BjXxCp1sYFJQKpLLbPbwd5juxbsYofu3TsS3auvT9Yi',
    '/dns4/node-01.do-ams3.status.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAkukebeXjTQ9QDBeNDWuGfbaSg79wkkhK4vPocLgR6QFDf',
    '/dns4/node-01.gc-us-central1-a.status.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmGDX3iAFox93PupVYaHa88kULGqMpJ7AEHGwj3jbMtt76',
    // Go
    // '/dns4/node-01.ac-cn-hongkong-c.go-waku.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmBDbMWFiG9ki8sDw6fYtraSxo4oHU9HbuN43S2HVyq1FD',
    // '/dns4/node-01.do-ams3.go-waku.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAm9vnvCQgCDrynDK1h7GJoEZVGvnuzq84RyDQ3DEdXmcX7',
    // '/dns4/node-01.gc-us-central1-a.go-waku.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmPz63Xc6AuVkDeujz7YeZta18rcdau3Y1BzaxKAfDrBqz',
  ],
}
