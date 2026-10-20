# AGENTS.md

Rules for agents working in `packages/status-js`. The root `AGENTS.md` also applies.

## Role

The published `@status-im/js` client library (browser and Node.js, Node >= 22): Waku communities,
chats and request client, plus Status protobuf types generated from `.proto` sources.

## Commands

- `pnpm --filter @status-im/js dev`: Vite library build in watch mode.
- `pnpm --filter @status-im/js build`: Vite build plus `tsc` declaration emit.
- `pnpm --filter @status-im/js protos`: regenerate the generated protobuf files (see below).
- `pnpm --filter @status-im/js protos:lint` and `protos:list`: lint and list proto sources.
- `pnpm --filter @status-im/js test` and `test:update`.

## Rules

- Never hand-edit `src/protos/*_pb.ts`; they are generated from `src/protos/*.proto` by
  `pnpm protos` (buf with `buf.gen.yaml`, output `./src/protos`). Edit the `.proto` and regenerate.
- Keep public exports in `src/index.ts`. The `./encode-url-data` and `./create-url` subpath
  exports map to `src/utils/encode-url-data.ts` and `src/utils/create-url.ts`.

## Gotchas

- `build:types` runs `tsc ... || true`, so it can pass with type errors; `typecheck` is the real
  check and what CI should gate on.
- Protocol messages are coupled to the Status protocol version; run `protos:lint` when changing
  `.proto` files.

## Docs

- [README.md](README.md): install and usage.
