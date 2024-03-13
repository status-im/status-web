/**
 * source: @see https://fleets.status.im
 */

// note!: users may experience additional latency due to cross-regional connection
// todo: use "dynamic" discovery protocol instead
// todo?: use a regional map together with an environment variable for the peer selection (e.g. `VERCEL_REGION`, but probably limited to  Serverless Functions)
export const peers = {
  // production: [],
  test: [
    '/dns4/store-01.do-ams3.shards.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmAUdrQ3uwzuE4Gy4D56hX6uLKEeerJAnhKEHZ3DxF1EfT',
    '/dns4/store-02.do-ams3.shards.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAm9aDJPkhGxc2SFcEACTFdZ91Q5TJjp76qZEhq9iF59x7R',
    '/dns4/store-01.gc-us-central1-a.shards.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmMELCo218hncCtTvC2Dwbej3rbyHQcR8erXNnKGei7WPZ',
    '/dns4/store-02.gc-us-central1-a.shards.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmJnVR7ZzFaYvciPVafUXuYGLHPzSUigqAmeNw9nJUVGeM',
    '/dns4/store-01.ac-cn-hongkong-c.shards.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAm2M7xs7cLPc3jamawkEqbr7cUJX11uvY7LxQ6WFUdUKUT',
    '/dns4/store-02.ac-cn-hongkong-c.shards.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAm9CQhsuwPR54q27kNj9iaQVfyRzTGKrhFmr94oD8ujU6P',
  ],
}
