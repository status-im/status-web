#!/usr/bin/env node
//
// Guarantees `content/specs` has content before Contentlayer runs.
//
// `content/specs` is a git submodule (status-im/status-specs). A build host
// that clones the repo without `git submodule update --init` leaves the
// directory empty, Contentlayer emits zero SpecsDocs, and the build still
// succeeds, shipping an empty `/specs` hub where every `/specs/*` detail URL
// 404s. That is what took the whole specs section down in production.
//
// Order of recovery:
//   1. content already there            -> nothing to do
//   2. parent repo available            -> initialize the submodule
//   3. no parent repo (e.g. image build -> shallow clone the specs repo
//      that drops `.git` from context)
//   4. still empty                      -> fail loudly instead of silently
//                                          dropping every spec page
//
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SPECS_DIR = path.join(APP_DIR, 'content', 'specs')
// The docs themselves live one level down; `content/specs` itself also holds a
// README, so its mere existence says nothing about whether the docs are there.
const SPECS_DOCS_DIR = path.join(SPECS_DIR, 'status')

// Overridable so a build can pin a different fork or revision without a code
// change; defaults mirror `.gitmodules`, which is not part of every build
// context.
const SPECS_REPO_URL =
  process.env.SPECS_REPO_URL ?? 'https://github.com/status-im/status-specs.git'
const SPECS_REF = process.env.SPECS_REF ?? 'master'

function hasSpecsContent() {
  return existsSync(SPECS_DOCS_DIR) && readdirSync(SPECS_DOCS_DIR).length > 0
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' })

  return result.status === 0
}

function findRepositoryRoot() {
  const result = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: APP_DIR,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    return undefined
  }

  return result.stdout.trim()
}

if (hasSpecsContent()) {
  process.exit(0)
}

const repositoryRoot = findRepositoryRoot()

if (repositoryRoot) {
  console.warn('⚠️  content/specs is empty. Initializing the submodule.')
  run(
    'git',
    ['submodule', 'update', '--init', '--recursive', '--', SPECS_DIR],
    repositoryRoot,
  )
}

if (!hasSpecsContent()) {
  console.warn(
    `⚠️  content/specs is still empty. Cloning ${SPECS_REPO_URL}#${SPECS_REF}.`,
  )
  run('git', [
    'clone',
    '--depth',
    '1',
    '--branch',
    SPECS_REF,
    SPECS_REPO_URL,
    SPECS_DIR,
  ])
}

if (!hasSpecsContent()) {
  console.error(
    `\n✖ No specs content in ${SPECS_DOCS_DIR}.\n` +
      `  Building now would ship an empty /specs hub and 404 every /specs/* page.\n` +
      `  Run \`git submodule update --init --recursive\` on the build host, or set\n` +
      `  SPECS_REPO_URL / SPECS_REF if the specs repository moved.\n`,
  )
  process.exit(1)
}
