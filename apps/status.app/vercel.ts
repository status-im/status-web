export const config = {
  fluid: true,
  functions: {
    'src/app/**/*': {
      maxDuration: 15,
    },
  },
  git: {
    deploymentEnabled: {
      develop: false,
      master: false,
      'dependabot/npm_and_yarn/playwright-*': false,
      'docs/**': false,
      '**/*-no-deploy': false,
    },
  },
  ignoreCommand:
    'case "$VERCEL_GIT_COMMIT_REF" in develop|master) exit 1 ;; esac; git diff --quiet HEAD^ HEAD ../../{patches,package.json,turbo.json} ../../packages/{colors,icons,components,status-js} ./',
  installCommand: 'pnpm install --dir ../../ --frozen-lockfile',
  buildCommand: 'turbo run build --cwd ../../ --filter=./apps/status.app...',
}
