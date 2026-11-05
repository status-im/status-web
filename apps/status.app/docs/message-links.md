# Message links

Reference for the `/m/<chatId>?message-id=<messageId>` route, which shows the web preview of the community channel a message belongs to and hands the message off to the Status app. The route lives in [`src/app/(sharing)/m/[slug]/`](<../src/app/(sharing)/m/[slug]/page.tsx>) and reuses the shared [preview page](<../src/app/(sharing)/_components/preview-page.tsx>).

## URL format

```
https://status.app/m/<chatId>?message-id=<messageId>
```

| Part         | Format                                              |
| ------------ | --------------------------------------------------- |
| `chatId`     | Community ID followed directly by the channel UUID  |
| Community ID | `0x` plus 66 hex characters (compressed public key) |
| Channel UUID | Standard UUID with dashes                           |
| `messageId`  | `0x` plus 64 hex characters                         |

There is no separator between the community ID and the channel UUID. For example:

```
/m/0x02b5bdaf5a25fcfe2ee14c501fab1836b8de57f61621080c3d52073d16de0d98d6cf678d5b-87e7-4275-8621-67d96d974c1a?message-id=0xbbf7b4bd87f814d3ba128dd6090423c049ba180436fabaec394572483d4de6f9
```

[`_parse-message-link.ts`](<../src/app/(sharing)/m/[slug]/_parse-message-link.ts>) splits the slug. If `chatId` does not match, the page shows the "not found" sharing error page. A missing or malformed `message-id`, or one given more than once, is dropped and the page still renders.

## What the page shows

The page renders the channel preview, the same one `/cc` uses, with the title "View message in Status" and the channel Open Graph image. It passes the community ID from the slug to `useURLData` in place of the URL hash, then fetches the community description from Waku. It does not show the message itself.

"View channel in Status" opens:

```
status-app://m/<chatId>?message-id=<messageId>
```

The `message-id` query is added only when the link had a valid one. Any URL hash is kept and appended after it.

## Routing and indexing

`/m` is excluded from the i18n middleware matcher in [`src/middleware.ts`](../src/middleware.ts), so it has no locale prefix. [`src/app/robots.ts`](../src/app/robots.ts) disallows `/m` and `/m/*`, like the other sharing routes.

## How the preview data loads

Message links carry no URL-encoded data, so the preview depends on the Waku store, as `/cc/<uuid>`, `/c#<key>` and `/u#<key>` do. Store nodes on `status.prod` and `status.staging` never answer store queries without a time range, so [`@status-im/js`](../../../packages/status-js/README.md) queries each shard in parallel in 24-hour windows, newest first, going back up to 30 days. It stops at the first window with a valid message. Each shard also has a 30 s timeout, because a store node can accept a query and never reply.

If the community has published nothing in the last 30 days, or every shard times out, the lookup returns nothing.

## Testing locally

1. Build the SDK and start the dev server:

   ```
   pnpm --filter @status-im/js build && pnpm --filter status.app dev:next
   ```

2. Open the example link above on http://localhost:3001. The `#general` channel preview of the Status community loads.
3. Open `/m/foo`. You see the "not found" sharing error page.
4. Run the tests:

   ```
   pnpm --filter @status-im/js test && pnpm --filter status.app test
   ```
