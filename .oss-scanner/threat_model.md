# status-web security context

This repository contains Status websites, web applications, a browser wallet,
a browser connector, shared packages, an API, and community contracts. Focus on
vulnerabilities in code maintained in this repository. Dependencies and Git
submodules are present for builds, but findings should identify a vulnerable
path in this repository's own code.

## Priority trust boundaries

- `apps/wallet`, `packages/wallet`, and `packages/ethereum-provider`: websites,
  browser messages, transaction requests, signatures, account access, and
  wallet state. An untrusted site must not gain wallet authority without the
  intended user approval.
- `apps/connector`: messages between webpages and the extension, including
  origin checks, connection state, and RPC method permissions.
- `apps/hub`, `apps/status.app`, `apps/api`, and `apps/portfolio`: user-controlled
  URL parameters, forms, uploaded or external content, authentication, API
  requests, and server-side calls to third parties.
- `packages/community-contracts` and `apps/community-dapp`: contract access
  control, voting and token flows, transaction construction, and state changes.

Prioritize issues with a concrete path from untrusted input to a security
impact. Explain the required preconditions, provide a safe reproducer, and
identify the affected code. Review any proposed patch against normal product
behavior and existing tests.

## Useful checks in the offline image

The Dockerfile installs workspace dependencies and builds the wallet,
connector, shared JavaScript package, and community contracts. The following
tests can run without a network connection:

```sh
pnpm --filter @status-im/js test
pnpm --filter @status-im/wallet test
WXT_STATUS_API_URL=http://127.0.0.1:3030 pnpm --filter wallet test
pnpm --filter api test
pnpm --filter status.app test
pnpm --filter @status-im/community-contracts test
```

The full Next.js production builds require external build-time services and
credentials. Their source and unit tests remain available in the image.
