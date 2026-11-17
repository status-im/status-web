# Deployment

How status-web gets built and shipped: the Jenkins pipelines in [`ci/`](../ci), Vercel previews, browser extension releases, and why nothing is published to npm right now.

## Jenkins

Two of the three pipelines take the app name as a build parameter, so one file serves several Jenkins jobs. `master` is what they treat as production; every other branch is development.

### ci/Jenkinsfile

Builds the `connector` and `wallet` extensions with Turbo, zips the Chrome build output (`.output/chrome-mv3` for the wallet, `build/chrome-mv3-prod` for the connector), and archives the ZIP. Branch builds also upload it with `s5cmd`; PR builds use the Jenkins archive because the shared library has no PR bucket mapping for this repo. Nothing is submitted to a store. The pipeline skips itself unless something under the selected app or its shared packages changed, or `FORCE_BUILD` is set.

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

[`Vercel branch deploy`](../.github/workflows/vercel-deploy.yml) owns deploys from `develop` (preview) and `master` (production). Keep native Git deploys disabled for those branches in each connected project's `vercel.json`. The workflow uses the existing `VERCEL_TOKEN` and `VERCEL_ORG_ID` repository secrets to request builds for the selected projects through the Vercel API.

The [deployment plan](../ci/vercel-deploy-plan.mjs) compares the whole push before requesting any builds. It skips repo docs, `e2e/`, and changes to the deployment policy itself. It also skips lockfile changes from verified Playwright Dependabot PRs that only update the test workspace. Any incidental lockfile changes from those PRs take effect on the next app deployment. Other lockfile changes use Turbo's dependency analysis. Markdown under published content directories still triggers deployments for its apps.

Native Git previews exclude `docs/*` branches and Dependabot's Playwright branch. Use the `-no-deploy` branch suffix to opt out of a preview on another feature branch. The branch name does not affect the workflow's decision after a merge. Vercel's [Skip deployments setting](https://vercel.com/docs/monorepos#skipping-unaffected-projects) filters unaffected projects on preview branches. A project's `ignoreCommand` overrides the dashboard's Ignored Build Step. It lets the workflow's `develop` and `master` builds proceed once requested and still filters other branches after queueing.

[`hub`](../apps/hub/vercel.json) uses Jenkins for automatic deployments. [`get.status.app`](../apps/get.status.app/vercel.json) receives only `master` deployments from the branch workflow because its public hostname is assigned to its Vercel project. Both disable native Vercel Git deployments on all branches.

[`apps/status.app/vercel.json`](../apps/status.app/vercel.json) also enables Fluid Compute (`"fluid": true`) and sets `maxDuration` to 15 seconds for every function under `src/app/**/*`. Together with the 3-second timeout on regular Ghost requests, this limits how long status.app functions run while Ghost is down.

[`.github/workflows/preview-deploy.yml`](../.github/workflows/preview-deploy.yml) deploys previews only for pull requests opened from forks, and the job runs in the `preview-deploy-approval` environment. Turbo decides which of `status.app`, `hub`, `portfolio`, `api`, `status.network` and the components Storybook are affected, and the workflow posts the preview URLs as a PR comment.

## Extension store releases

The wallet Jenkins job stops at a ZIP. Uploading it to the existing Chrome Web Store item and publishing are manual and belong to the release owner; [`apps/wallet/README.md`](../apps/wallet/README.md#chrome-web-store-release) has the steps.

The connector ships through the Chrome Web Store, and Safari and Firefox need manual `xcodebuild` and zip builds; [`apps/connector/README.md`](../apps/connector/README.md) has the steps.

## npm packages

There is no publish flow. Changesets and the `release.yml` workflow were removed on purpose in `379a8f38` (2026-08-25) and nothing replaced them, so version bumps here do not reach the registry. `@status-im/js` is at 1.2.2 in the repo while npm has 1.2.1 (published 2025-12-10), `@status-im/components` is at 1.2.0 against 1.1.0 on npm, and `@status-im/ethereum-provider` is not private yet has never been published. The `CHANGELOG.md` files stay as history.

Publishing by hand is possible but has no owner. Until there is a flow, treat the npm badges in the root [README.md](../README.md) as the state of the registry, not of the code.
