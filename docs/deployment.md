# Deployment

How status-web gets built and shipped: the Jenkins pipelines in [`ci/`](../ci), Vercel previews, browser extension releases, and why nothing is published to npm right now.

## Jenkins

Two of the three pipelines take the app name as a build parameter, so one file serves several Jenkins jobs. `master` is what they treat as production; every other branch is development.

### ci/Jenkinsfile

Builds the `connector` and `wallet` extensions with Turbo, zips the Chrome build output (`.output/chrome-mv3` for the wallet, `build/chrome-mv3-prod` for the connector), archives the ZIP and uploads it with `s5cmd`. Nothing is submitted to a store. The pipeline skips itself unless something under the selected app or its shared packages changed, or `FORCE_BUILD` is set.

### ci/website.Jenkinsfile

Builds `hub`, `status.network` or `get.status.app` as a static export and publishes its `out/` directory to a `deploy-*` branch with `ghp-import`, which GitHub Pages serves on the matching domain.

| `APP_NAME`       | Branch (master)                | Branch (otherwise)              | Domain (master)    | Domain (otherwise)     |
| ---------------- | ------------------------------ | ------------------------------- | ------------------ | ---------------------- |
| `hub`            | `deploy-hub-main`              | `deploy-hub-develop`            | hub.status.network | dev-hub.status.network |
| `status.network` | `deploy-status-network-main`   | `deploy-status-network-develop` | status.network     | dev.status.network     |
| `get.status.app` | `deploy-get-status-app-master` | `deploy-get-status-app-develop` | get.status.app     | dev-get.status.app     |

The `status.network` job also checks out the `legal-external` submodule and passes the Ghost API URL and key, which come from the `status-network-ghost-api-key` Jenkins credential.

### ci/docker.Jenkinsfile

Builds the `apps/status.app` image from [`Dockerfile`](../apps/status.app/Dockerfile) and pushes it to Harbor as `status-web/status-app`, tagged with the short commit SHA plus `deploy-master` or `deploy-develop`. The image is the self-hosted option for status.app; the public site is also on Vercel. See [`apps/status.app/docs/self-hosting.md`](../apps/status.app/docs/self-hosting.md).

## Vercel

Every app except the two extensions has a `vercel.json` with its own build command and an `ignoreCommand`, so a push that touches neither the app nor its workspace dependencies skips the rebuild. The root [`vercel.json`](../vercel.json) turns off automatic deployments for `main`, which is not a branch here.

[`.github/workflows/preview-deploy.yml`](../.github/workflows/preview-deploy.yml) deploys previews only for pull requests opened from forks, and the job runs in the `preview-deploy-approval` environment. Turbo decides which of `status.app`, `hub`, `portfolio`, `api`, `status.network` and the components Storybook are affected, and the workflow posts the preview URLs as a PR comment.

## Extension store releases

The wallet Jenkins job stops at a ZIP. Uploading it to the existing Chrome Web Store item and publishing are manual and belong to the release owner; [`apps/wallet/README.md`](../apps/wallet/README.md#chrome-web-store-release) has the steps.

The connector ships through the Chrome Web Store, and Safari and Firefox need manual `xcodebuild` and zip builds; [`apps/connector/README.md`](../apps/connector/README.md) has the steps.

## npm packages

There is no publish flow. Changesets and the `release.yml` workflow were removed on purpose in `379a8f38` (2026-08-25) and nothing replaced them, so version bumps here do not reach the registry. `@status-im/js` is at 1.2.2 in the repo while npm has 1.2.1 (published 2025-12-10), `@status-im/components` is at 1.2.0 against 1.1.0 on npm, and `@status-im/ethereum-provider` is not private yet has never been published. The `CHANGELOG.md` files stay as history.

Publishing by hand is possible but has no owner. Until there is a flow, treat the npm badges in the root [README.md](../README.md) as the state of the registry, not of the code.
