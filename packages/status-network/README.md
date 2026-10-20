# @status-im/status-network

Private shared UI and config for the Status Network site ([apps/status.network](../../apps/status.network))
and the hub ([apps/hub](../../apps/hub)). Not published to npm.

## What is in it

Built from [src](./src) and exported as subpaths:

| Subpath                                     | Contents                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------ |
| `@status-im/status-network/components`      | Site components: buttons, cards, footer, dropdown, feedback popover                  |
| `@status-im/status-network/config`          | Shared routes, URLs and legal links ([src/config/routes.ts](./src/config/routes.ts)) |
| `@status-im/status-network/hooks`           | `useCopyToClipboard`                                                                 |
| `@status-im/status-network/utils`           | Metadata generation, middleware, colors, date and path helpers                       |
| `@status-im/status-network/tailwind.config` | Tailwind preset shared by the two sites                                              |

Both sites import from this package so their shared UI stays in sync.

## Run

    pnpm --filter @status-im/status-network build

## More

- [Tailwind config](./tailwind.config.ts): theme preset used by status.network and hub.
