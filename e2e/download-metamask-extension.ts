import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const METAMASK_VERSION = process.env.METAMASK_VERSION ?? '13.18.1'

const defaultDest = path.resolve(process.cwd(), '.extensions', 'metamask')
const envPath = process.env.METAMASK_EXTENSION_PATH
const destDir = envPath
  ? path.isAbsolute(envPath)
    ? envPath
    : path.resolve(process.cwd(), envPath)
  : defaultDest

const url = `https://github.com/MetaMask/metamask-extension/releases/download/v${METAMASK_VERSION}/metamask-chrome-${METAMASK_VERSION}.zip`

console.log(`Downloading MetaMask v${METAMASK_VERSION}...`)

const res = await fetch(url, { redirect: 'follow' })

if (!res.ok) {
  throw new Error(
    `Failed to download MetaMask v${METAMASK_VERSION}: ${res.status} ${res.statusText}`,
  )
}

const arrayBuffer = await res.arrayBuffer()
const zipData = Buffer.from(arrayBuffer)

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'metamask-'))
const zipPath = path.join(tmpDir, 'metamask.zip')
fs.writeFileSync(zipPath, zipData)

fs.rmSync(destDir, { recursive: true, force: true })
fs.mkdirSync(destDir, { recursive: true })

const unzip = spawnSync('unzip', ['-o', zipPath, '-d', destDir], {
  stdio: 'inherit',
})

if (unzip.status !== 0) {
  throw new Error(
    'Failed to unzip extension. Make sure `unzip` is installed.',
  )
}

fs.rmSync(tmpDir, { recursive: true, force: true })

console.log(`MetaMask v${METAMASK_VERSION} extracted to: ${destDir}`)