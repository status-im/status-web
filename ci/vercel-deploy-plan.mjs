import { execFileSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'

const [base, head, branch] = process.argv.slice(2)
if (
  ![base, head].every(sha => /^[a-f0-9]{40}$/.test(sha)) ||
  !['develop', 'master'].includes(branch)
) {
  throw new Error(
    'Usage: node ci/vercel-deploy-plan.mjs <before SHA> <after SHA> <develop|master>',
  )
}

const projects = [
  ['apps/api', 'status-api'],
  ['apps/community-dapp', 'community-dapp'],
  ['apps/get.status.app', 'status-get-status-app', 'master'],
  ['apps/portfolio', 'status-portfolio'],
  ['apps/status.app', 'status-website'],
  ['apps/status.network', 'status-network-website'],
  ['packages/components', 'status-components'],
]

const run = (program, args, env = process.env) =>
  execFileSync(program, args, { encoding: 'utf8', env })
const git = (...args) => run('git', args)
const changedFiles = (before, after) =>
  git('diff', '--name-only', '--no-renames', '-z', before, after, '--')
    .split('\0')
    .filter(Boolean)
const isDocsOrTest = file =>
  file.startsWith('e2e/') ||
  [
    '.github/dependabot.yml',
    '.github/docs-sync.yml',
    '.github/workflows/ai-docs-sync.yml',
    '.github/workflows/e2e.yml',
    '.github/workflows/e2e-daily.yml',
  ].includes(file) ||
  /^(?:(?:apps|packages)\/[^/]+\/)?(?:README|AGENTS)\.md$/.test(file) ||
  /^(?:(?:apps|packages)\/[^/]+\/)?docs\/.*\.mdx?$/.test(file)

function isDeploymentPolicy(file) {
  if (
    file === '.github/workflows/vercel-deploy.yml' ||
    file === 'ci/vercel-deploy-plan.mjs'
  ) {
    return true
  }
  if (file !== 'vercel.json' && !file.endsWith('/vercel.json')) return false

  try {
    const settings = [base, head].map(sha => {
      const config = JSON.parse(git('show', `${sha}:${file}`))
      delete config.git
      delete config.ignoreCommand
      return config
    })
    return isDeepStrictEqual(...settings)
  } catch {
    return false
  }
}

function isPlaywrightUpdate(commit) {
  const parent = git('rev-parse', `${commit}^1`).trim()
  const files = changedFiles(parent, commit)
  if (
    !files.includes('e2e/package.json') ||
    files.some(file => file !== 'pnpm-lock.yaml' && !isDocsOrTest(file))
  ) {
    return false
  }

  const before = JSON.parse(git('show', `${parent}:e2e/package.json`))
  const after = JSON.parse(git('show', `${commit}:e2e/package.json`))
  const dependency = '@playwright/test'
  const oldVersion = before.devDependencies?.[dependency]
  const newVersion = after.devDependencies?.[dependency]
  if (
    typeof oldVersion !== 'string' ||
    typeof newVersion !== 'string' ||
    oldVersion === newVersion
  ) {
    return false
  }
  delete before.devDependencies[dependency]
  delete after.devDependencies[dependency]
  if (!isDeepStrictEqual(before, after) || !process.env.GITHUB_REPOSITORY)
    return false

  // A title or commit message can be copied. Match the merged PR recorded by GitHub.
  try {
    const pulls = JSON.parse(
      run('gh', [
        'api',
        `repos/${process.env.GITHUB_REPOSITORY}/commits/${commit}/pulls`,
      ]),
    )
    return pulls.some(
      pr =>
        pr.merged_at &&
        pr.merge_commit_sha === commit &&
        pr.user?.login === 'dependabot[bot]' &&
        pr.head?.repo?.full_name === process.env.GITHUB_REPOSITORY &&
        /^dependabot\/npm_and_yarn\/playwright-/.test(pr.head.ref),
    )
  } catch {
    console.warn(
      'Could not verify the Playwright PR. Using normal lockfile change detection.',
    )
    return false
  }
}

function turboPaths(args, env) {
  const result = JSON.parse(
    run(
      'npm',
      [
        'exec',
        '--yes',
        '--package=turbo@2.6.1',
        '--',
        'turbo',
        'ls',
        '--output=json',
        ...args,
      ],
      env,
    ),
  )
  return result.packages.items.map(({ path }) => path)
}

function affectedDirectories(files) {
  if (!files.length) return []
  const workspacePaths = new Set(turboPaths([]))
  const changedWorkspaces = new Set(
    files
      .filter(file => file !== 'pnpm-lock.yaml')
      .map(file => file.match(/^(apps|packages)\/[^/]+(?=\/|$)/)?.[0]),
  )
  if ([...changedWorkspaces].some(path => !workspacePaths.has(path))) {
    // Root build inputs and unrecognised paths may affect every project.
    return [...workspacePaths]
  }

  const affected = new Set()
  if (changedWorkspaces.size) {
    const filters = [...changedWorkspaces].map(
      path => `--filter=...{./${path}}`,
    )
    for (const path of turboPaths(filters)) affected.add(path)
  }
  if (files.includes('pnpm-lock.yaml')) {
    for (const path of turboPaths(['--affected'], {
      ...process.env,
      TURBO_SCM_BASE: base,
      TURBO_SCM_HEAD: head,
    })) {
      affected.add(path)
    }
  }

  // The download site reads status.app source and assets via filesystem aliases.
  if (affected.has('apps/status.app')) affected.add('apps/get.status.app')
  return [...affected]
}

let files = changedFiles(base, head).filter(
  file => !isDocsOrTest(file) && !isDeploymentPolicy(file),
)
if (files.includes('pnpm-lock.yaml')) {
  const lockfileCommits = git(
    'rev-list',
    `${base}..${head}`,
    '--',
    'pnpm-lock.yaml',
  )
    .trim()
    .split('\n')
    .filter(Boolean)
  if (lockfileCommits.length && lockfileCommits.every(isPlaywrightUpdate)) {
    files = files.filter(file => file !== 'pnpm-lock.yaml')
  }
}

const affected = new Set(affectedDirectories(files))
const deployments = projects
  .filter(
    ([path, , onlyBranch]) =>
      affected.has(path) && (!onlyBranch || onlyBranch === branch),
  )
  .map(([, name]) => name)
const output = JSON.stringify(deployments)
console.log(output)
if (process.env.GITHUB_OUTPUT)
  appendFileSync(process.env.GITHUB_OUTPUT, `projects=${output}\n`)
