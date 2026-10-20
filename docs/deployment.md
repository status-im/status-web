# Deployment

How status-web is built and shipped: Jenkins pipelines in [`ci/`](../ci), Vercel projects, browser extension store releases, and the state of npm publishing.

## Jenkins

### ci/Jenkinsfile

Builds the two browser extensions (`connector`, `wallet`), zips the build output, archives it and uploads the ZIP. It does not submit anything to a store. See [Extension store releases](#extension-store-releases).

### ci/website.Jenkinsfile

Builds the static apps (`hub`, `status.network`, `get.status.app`) and publishes their `out/` dir to a `deploy-*` branch via `ghp-import`, which GitHub Pages serves under a per-app domain.

| APP_NAME         | Branch (master)                | Branch (otherwise)              | Domain (master)    | Domain (otherwise)     |
| ---------------- | ------------------------------ | ------------------------------- | ------------------ | ---------------------- |
| `hub`            | `deploy-hub-main`              | `deploy-hub-develop`            | hub.status.network | dev-hub.status.network |
| `status.network` | `deploy-status-network-main`   | `deploy-status-network-develop` | status.network     | dev.status.network     |
| `get.status.app` | `deploy-get-status-app-master` | `deploy-get-status-app-develop` | get.status.app     | dev-get.status.app     |

### ci/docker.Jenkinsfile

Builds the `apps/status.app` Docker image (self-hosted `status.app`) and pushes it to Harbor as `status-web/status-app`, tagged `deploy-master` on master or `deploy-develop` otherwise.

## Vercel

Root [`vercel.json`](../vercel.json) disables auto-deploys on `main`; each deployable app and `packages/components` has its own `vercel.json`. [`.github/workflows/preview-deploy.yml`](../.github/workflows/preview-deploy.yml) deploys PR previews for `status.app`, `hub`, `portfolio`, `api`, `status.network` and the components Storybook, and posts the preview URLs as a PR comment.

## Extension store releases

- **wallet**: the Jenkins job only builds and zips; uploading to the existing Chrome Web Store item and publishing is manual and owned by the release owner (see [`apps/wallet/README.md`](../apps/wallet/README.md)).
- **connector**: Chrome Web Store plus manual Safari (`xcodebuild`) and Firefox builds (see [`apps/connector/README.md`](../apps/connector/README.md)).

## npm packages

There is no publish flow. Changesets and `release.yml` were removed in `379a8f38` (#1309, 2026-08-25) with no replacement. The last npm publish was `@status-im/js@1.2.1` on 2025-12-10. `@status-im/components` 1.2.0 and `@status-im/js` 1.2.2 are bumped in the repo but not on npm. `@status-im/ethereum-provider` is not private and has never been published. `CHANGELOG.md` files are kept as history.
