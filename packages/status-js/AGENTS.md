# packages/status-js

Rules for agents working in `packages/status-js`. The root [AGENTS.md](../../AGENTS.md) applies too. The folder publishes as `@status-im/js`, a client for Status communities over Waku, with the Status protobuf types and an Ethereum client.

## Commands

- `pnpm --filter @status-im/js dev`: Vite build in watch mode.
- `pnpm --filter @status-im/js build`: Vite build plus `tsc` declarations.
- `pnpm --filter @status-im/js test` and `test:update` (vitest, happy-dom).
- `pnpm --filter @status-im/js protos`: regenerate `src/protos/*_pb.ts` from the `.proto` files with buf ([buf.gen.yaml](./buf.gen.yaml)).
- `pnpm --filter @status-im/js protos:lint` and `protos:list`.

## Rules

- Never edit `src/protos/*_pb.ts` by hand. Change the `.proto` file and run `pnpm protos`.
- Keep the public surface in [src/index.ts](./src/index.ts). The `./encode-url-data` and `./create-url` subpaths map to `src/utils/encode-url-data.ts` and `src/utils/create-url.ts`, and both are declared in `exports` and `typesVersions` in `package.json`; update the file, the export and the type mapping together.
- Run `protos:lint` whenever you touch a `.proto` file. The messages mirror the Status protocol, not this repo's needs.

## Caveats

- `build:types` ends in `|| true`, so it can pass with type errors. `typecheck` is the check to gate on.
- `encode-url-data` uses Node's `zlib` for brotli and has `"browser": null` in its export. Import it from server code only, never from a client bundle.
- `createClient` and `createRequestClient` default to `environment: 'development'`; the peers are the same as production for all three environments today.

## Docs

- [README.md](./README.md): install, usage and subpath exports.
